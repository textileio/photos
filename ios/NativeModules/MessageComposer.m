//
//  MessageComposer.m
//  Textile
//
//  Created by Aaron Sutula on 2/4/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MessageComposer.h"
#import <MessageUI/MessageUI.h>

@interface MessageComposer () <MFMessageComposeViewControllerDelegate>

@end

@implementation MessageComposer

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(composeMessage:(NSString *)number message:(NSString *)message) {
  if (![MFMessageComposeViewController canSendText]) {
    NSLog(@"Message services are not available.");
    return;
  }
  dispatch_async(dispatch_get_main_queue(),^{
    MFMessageComposeViewController* composeVC = [[MFMessageComposeViewController alloc] init];
    composeVC.messageComposeDelegate = self;

    // Configure the fields of the interface.
    composeVC.recipients = @[number];
    composeVC.body = message;

    // Present the view controller modally.
    UIViewController *topController = [self topMostController];
    [topController presentViewController:composeVC animated:YES completion:nil];
  });
}

- (void)messageComposeViewController:(MFMessageComposeViewController *)controller didFinishWithResult:(MessageComposeResult)result {
  dispatch_async(dispatch_get_main_queue(),^{
    [controller dismissViewControllerAnimated:YES completion:nil];
  });
}

- (UIViewController*)topMostController {
  return [UIApplication sharedApplication].keyWindow.rootViewController;
//  return [self visibleControllerForController:[UIApplication sharedApplication].keyWindow.rootViewController];
}

- (UIViewController*)visibleControllerForController:(UIViewController*)controller {
  // Determine last controller in navigation stack
  UIViewController *topViewController = controller;
  if ([controller isKindOfClass:[UITabBarController class]]) {
    topViewController = ((UITabBarController*)controller).selectedViewController;
  }
  if ([controller isKindOfClass:[UINavigationController class]]) {
    topViewController = ((UINavigationController*)controller).topViewController;
  } else if (controller.navigationController) {
    topViewController = controller.navigationController.topViewController;
  }

  // If last controller is presenting a modal recurse - find the last controller in that navigation stack
  UIViewController *presentedViewController = topViewController.presentedViewController;
  if (presentedViewController && ! presentedViewController.isBeingDismissed) {
    return [[self class] visibleControllerForController:presentedViewController];
  }

  return topViewController;
}

@end
