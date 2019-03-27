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
    self.appState = AppStateNone;
    [self setup];
  }
  return self;
}

- (void)setup {
  [NSNotificationCenter.defaultCenter
   addObserverForName:UIApplicationDidBecomeActiveNotification
   object:nil
   queue:nil
   usingBlock:^(NSNotification *notification) {
     if (self.appState == AppStateForeground) {
       return;
     }
     self.appState = AppStateForeground;
     if ([self.timer isValid]) {
       [self.timer invalidate];
     } else {
       [self startNode];
     }
   }
  ];

  [NSNotificationCenter.defaultCenter
   addObserverForName:UIApplicationDidEnterBackgroundNotification
   object:nil
   queue:nil
   usingBlock:^(NSNotification *notification) {
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
  ];
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
  UIBackgroundTaskIdentifier bgTaskId = [UIApplication.sharedApplication beginBackgroundTaskWithName:@"RunNode" expirationHandler:^{
    [self stopNode];
  }];
  [self.timer invalidate];
  self.timer = [NSTimer scheduledTimerWithTimeInterval:delay repeats:FALSE block:^(NSTimer * _Nonnull timer) {
    [self stopNode];
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
