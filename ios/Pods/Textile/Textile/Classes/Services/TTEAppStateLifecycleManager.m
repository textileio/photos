#import "TTEAppStateLifecycleManager.h"
#import "Callback.h"

typedef NS_CLOSED_ENUM(NSInteger, AppState) {
  AppStateNone,
  AppStateBackground,
  AppStateForeground
};

@interface TTEAppStateLifecycleManager ()

@property (nonatomic, weak) Textile *textile;
@property (nonatomic, assign) AppState currentAppState;
@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, assign) UIBackgroundTaskIdentifier bgTaskId;

@end

@implementation TTEAppStateLifecycleManager

- (instancetype)initWithTextile:(Textile *)textile {
  if (self = [super init]) {
    self.textile = textile;
    self.currentAppState = AppStateNone;
    [self initializeAppState];
    [self setupAppStateSubscriptions];
  }
  return self;
}

- (void)initializeAppState {
  UIApplicationState state = UIApplication.sharedApplication.applicationState;
  if (state == UIApplicationStateActive || state == UIApplicationStateInactive) {
    [self processAppStateEvent:AppStateForeground];
  } else if (state == UIApplicationStateBackground) {
    [self processAppStateEvent:AppStateBackground];
  }
}

- (void)setupAppStateSubscriptions {
  __weak TTEAppStateLifecycleManager *weakSelf = self;

  [NSNotificationCenter.defaultCenter
   addObserverForName:UIApplicationDidBecomeActiveNotification
   object:nil
   queue:nil
   usingBlock:^(NSNotification * _Nonnull note) {
     [weakSelf processAppStateEvent:AppStateForeground];
   }];

  [NSNotificationCenter.defaultCenter
   addObserverForName:UIApplicationDidEnterBackgroundNotification
   object:nil
   queue:nil
   usingBlock:^(NSNotification * _Nonnull note) {
     [weakSelf processAppStateEvent:AppStateBackground];
   }];
}

- (void)processAppStateEvent:(AppState)appState {
  if (self.currentAppState == appState) {
    return;
  }
  if (appState == AppStateForeground) {
    self.currentAppState = AppStateForeground;
    [self start:nil];
  } else if (appState == AppStateBackground) {
    if (self.currentAppState == AppStateNone) {
      self.currentAppState = AppStateBackground;
      [self start:nil];
    } else if(self.currentAppState == AppStateForeground) {
      self.currentAppState = AppStateNone;
      [self requestStop];
    }
  }
}

- (void)requestStop {
  NSTimeInterval remaining = UIApplication.sharedApplication.backgroundTimeRemaining;
  NSTimeInterval runFor = MAX(remaining - 10, 0);
  __weak TTEAppStateLifecycleManager *weakSelf = self;
  self.bgTaskId = [UIApplication.sharedApplication beginBackgroundTaskWithName:@"RunNode" expirationHandler:^{
    NSLog(@"background task expired");
    [weakSelf stopWithCompletion:nil];
  }];
  NSLog(@"Allowing node to run for %d seconds before stop", (int)runFor);
  if ([self.textile.delegate respondsToSelector:@selector(willStopNodeInBackgroundAfterDelay:)]) {
    [self.textile.delegate willStopNodeInBackgroundAfterDelay:runFor];
  }
  self.timer = [NSTimer scheduledTimerWithTimeInterval:runFor repeats:FALSE block:^(NSTimer * _Nonnull timer) {
    NSLog(@"timer up");
    [weakSelf stopWithCompletion:nil];
  }];
}

- (BOOL)start:(NSError *__autoreleasing  _Nullable *)error {
  if ([self.timer isValid]) {
    NSLog(@"Canceling previous node stop request");
    if ([self.textile.delegate respondsToSelector:@selector(canceledPendingNodeStop)]) {
      [self.textile.delegate canceledPendingNodeStop];
    }
    [self.timer invalidate];
    if (self.bgTaskId) {
      [UIApplication.sharedApplication endBackgroundTask:self.bgTaskId];
    }
  }
  NSLog(@"starting node");
  BOOL started = [self.textile.node start:error];
  if (started && self.currentAppState == AppStateBackground) {
    NSLog(@"started node in background, so requesting stop");
    [self requestStop];
  } else if (!started && [self.textile.delegate respondsToSelector:@selector(nodeFailedToStartWithError:)]) {
    [self.textile.delegate nodeFailedToStartWithError:*error];
  }
  return started;
}

- (void)stopWithCompletion:(void (^)(BOOL success, NSError * _Nullable))completion {
  NSLog(@"stopping node");
  __weak TTEAppStateLifecycleManager *weakSelf = self;
  Callback *cb = [[Callback alloc] initWithCompletion:^(NSError * _Nullable error) {
    NSLog(@"node stop complete");
    BOOL success = error == nil;

    if (!success && [self.textile.delegate respondsToSelector:@selector(nodeFailedToStopWithError:)]) {
      [weakSelf.textile.delegate nodeFailedToStopWithError:error];
    }

    if (completion) {
      completion(success, error);
    }

    if (weakSelf.bgTaskId) {
      // Dispatch this after a slight delay to allow consumers of the stop node event to process the event before app suspension
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        NSLog(@"ending background task");
        [UIApplication.sharedApplication endBackgroundTask:weakSelf.bgTaskId];
      });
    }
  }];
  [self.textile.node stop:cb];
}

@end
