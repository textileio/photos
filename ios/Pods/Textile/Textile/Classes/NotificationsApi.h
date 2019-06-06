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

/**
 * Provides access to Textile notifications related APIs
 */
@interface NotificationsApi : NodeDependant

/**
 * List notifications
 * @param offset The offset to query from
 * @param limit The max number of notifications to return
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return An object containing a list of notifications
 */
- (NotificationList *)list:(nullable NSString *)offset limit:(long)limit error:(NSError **)error;

/**
 * @return The number of unread notifications
 */
- (long)countUnread;

/**
 * Mark a notification as read
 * @param notificationId The id of the notification to mark as read
 * @param error A reference to an error pointer that will be set in the case of an error
 */
- (void)read:(NSString *)notificationId error:(NSError **)error;

/**
 * Mark all notifications as read
 * @param error A reference to an error pointer that will be set in the case of an error
 */
- (void)readAll:(NSError **)error;

/**
 * Accept an invite via an invite notification
 * @param notificationId The id of the invite notification
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The hash of the newly created thread join block
 */
- (NSString *)acceptInvite:(NSString *)notificationId error:(NSError **)error;

/**
 * Ignore an invite via an invite notification
 * @param notificationId The id of the invite notification
 * @param error A reference to an error pointer that will be set in the case of an error
 */
- (void)ignoreInvite:(NSString *)notificationId error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
