//
//  InvitesApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/View.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Provides access to Textile invites related APIs
 */
@interface InvitesApi : NodeDependant

/**
 * Invite a contact to a thread
 * @param threadId The id of the thread to invite to
 * @param address The address of the contact to invite
 * @param error A reference to an error pointer that will be set in the case of an error
 */
- (void)add:(NSString *)threadId address:(NSString *)address error:(NSError **)error;

/**
 * Create an external invite, one for someone who isn't in Textile yet
 * @param threadId The id of the thread to invite to
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return An object representing the external invite
 */
- (ExternalInvite *)addExternal:(NSString *)threadId error:(NSError **)error;

/**
 * View a list of pending incoming invites
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return An object containing a list of pending invites
 */
- (InviteViewList *)list:(NSError **)error;

/**
 * Accept an invite
 * @param inviteId The id of the invite to accept
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The hash of the new thread join block
 */
- (NSString *)accept:(NSString *)inviteId error:(NSError **)error;

/**
 * Accept an external invite
 * @param inviteId The id of the external invite to accept
 * @param key The key associated with the external invite to accept
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The hash of the new thread join block
 */
- (NSString *)acceptExternal:(NSString *)inviteId key:(NSString *)key error:(NSError **)error;

/**
 * Ignore an invite
 * @param inviteId The id of the invite to ignore
 * @param error A reference to an error pointer that will be set in the case of an error
 */
- (void)ignore:(NSString *)inviteId error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
