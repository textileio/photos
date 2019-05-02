//
//  LifecycleManager.m
//  Textile
//
//  Created by Aaron Sutula on 3/3/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "LifecycleManager.h"
#import <UIKit/UIKit.h>

typedef NS_CLOSED_ENUM(NSInteger, AppState) {
  AppStateNone,
  AppStateBackground,
  AppStateForeground
};

@interface LifecycleManager()

@property (nonatomic, assign) AppState appState;
@property (nonatomic, strong) NSTimer *timer;

@end

@implementation LifecycleManager

- (instancetype)initWithNode:(MobileMobile *)node {
  if(self = [super initWithNode:node]) {
    [self setup];
  }
  return self;
}

- (void)setup {
  dispatch_async(dispatch_get_main_queue(), ^{
    self.appState = AppStateNone;

    UIApplicationState state = UIApplication.sharedApplication.applicationState;
    if (state == UIApplicationStateActive) {
      [self processNewState:AppStateForeground];
    } else if (state == UIApplicationStateBackground) {
      [self processNewState:AppStateBackground];
    }

    __weak LifecycleManager *weakSelf = self;

    [NSNotificationCenter.defaultCenter
     addObserverForName:UIApplicationDidBecomeActiveNotification
     object:nil
     queue:nil
     usingBlock:^(NSNotification *notification) {
       [weakSelf processNewState:AppStateForeground];
     }];

    [NSNotificationCenter.defaultCenter
     addObserverForName:UIApplicationDidEnterBackgroundNotification
     object:nil
     queue:nil
     usingBlock:^(NSNotification *notification) {
       [weakSelf processNewState:AppStateBackground];
     }];
  });
}

- (void)processNewState:(AppState)newState {
  if (self.appState == newState) {
    // bail if the state isn't changing
    return;
  }
  // TODO: consioldate/optimize this logic
  if (newState == AppStateForeground) {
    self.appState = AppStateForeground;
    if ([self.timer isValid]) {
      [self.timer invalidate];
      if ([self.delegate respondsToSelector:@selector(canceledPendingNodeStop)]) {
        [self.delegate canceledPendingNodeStop];
      }
    } else {
      [self startNode];
    }
  } else if (newState == AppStateBackground) {
    NSTimeInterval remaining = UIApplication.sharedApplication.backgroundTimeRemaining;
    NSTimeInterval runFor = MAX(remaining - 10, 0);
    if (self.appState == AppStateNone) {
      self.appState = AppStateBackground;
      if ([self.timer isValid]) {
        [self stopNodeAfterDelay:runFor];
      } else {
        [self startNode];
        [self stopNodeAfterDelay:runFor];
      }
    } else if(self.appState == AppStateForeground) {
      self.appState = AppStateNone;
      [self stopNodeAfterDelay:runFor];
    }
  }
}

- (void)startNode {
  [self.timer invalidate];
  NSError *error;
  [self.node start:&error];
  if (error) {
    if ([self.delegate respondsToSelector:@selector(nodeFailedToStartWithError:)]) {
      [self.delegate nodeFailedToStartWithError:error];
    }
  }
}

- (void)stopNodeAfterDelay:(NSTimeInterval)delay {
  __weak LifecycleManager *weakSelf = self;
  UIBackgroundTaskIdentifier bgTaskId = [UIApplication.sharedApplication beginBackgroundTaskWithName:@"RunNode" expirationHandler:^{
    [weakSelf stopNode];
  }];
  [self.timer invalidate];
  if ([self.delegate respondsToSelector:@selector(willStopNodeInBackgroundAfterDelay:)]) {
    [self.delegate willStopNodeInBackgroundAfterDelay:delay];
  }
  self.timer = [NSTimer scheduledTimerWithTimeInterval:delay repeats:FALSE block:^(NSTimer * _Nonnull timer) {
    [weakSelf stopNode];
    [UIApplication.sharedApplication endBackgroundTask:bgTaskId];
  }];
}

- (void)stopNode {
  NSError *error;
  [self.node stop:&error];
  if(error) {
    if ([self.delegate respondsToSelector:@selector(nodeFailedToStopWithError:)]) {
      [self.delegate nodeFailedToStopWithError:error];
    }
  }
}

@end
