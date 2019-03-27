//
//  NotificationsApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "NotificationsApi.h"

@implementation NotificationsApi

- (NotificationList *)list:(NSString *)offset limit:(long)limit error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node notifications:offset != nil ? offset : @"" limit:limit error:error];
  return [[NotificationList alloc] initWithData:data error:error];
}

- (long)countUnread {
  return [self.node countUnreadNotifications];
}

- (void)read:(NSString *)notificationId error:(NSError * _Nullable __autoreleasing *)error  {
  [self.node readNotification:notificationId error:error];
}

- (void)readAll:(NSError * _Nullable __autoreleasing *)error  {
  [self.node readAllNotifications:error];
}

- (NSString *)acceptInvite:(NSString *)id_ error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node acceptInviteViaNotification:id_ error:error];
}

- (void)ignoreInvite:(NSString *)id_ error:(NSError * _Nullable __autoreleasing *)error {
  [self.node ignoreInviteViaNotification:id_ error:error];
}

@end
