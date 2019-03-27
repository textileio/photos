//
//  NotificationsApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/Model.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

@interface NotificationsApi : NodeDependant

- (NotificationList *)list:(nullable NSString *)offset limit:(long)limit error:(NSError **)error;
- (long)countUnread;
- (void)read:(NSString *)notificationId error:(NSError **)error;
- (void)readAll:(NSError **)error;
- (NSString *)acceptInvite:(NSString *)id_ error:(NSError **)error;
- (void)ignoreInvite:(NSString *)id_ error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
