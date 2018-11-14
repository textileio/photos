#import "ScreenControl.h"

// import RCTBridge
#if __has_include(<React/RCTBridge.h>)
#import <React/RCTBridge.h>
#elif __has_include(“RCTBridge.h”)
#import “RCTBridge.h”
#else
#import “React/RCTBridge.h” // Required when used as a Pod in a Swift project
#endif

@implementation ScreenControl

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(letScreenSleep) {
  UIApplication.sharedApplication.idleTimerDisabled = NO;
}

RCT_EXPORT_METHOD(keepScreenOn) {
  UIApplication.sharedApplication.idleTimerDisabled = YES;
}

@end
