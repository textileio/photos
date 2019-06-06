//
//  MessagesApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/View.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Provides access to Textile messages related APIs
 */
@interface MessagesApi : NodeDependant

/**
 * Add a text message to a thread
 * @param threadId The id of the thread to add the message to
 * @param body The body of the message
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The hash of the newly created message block
 */
- (NSString *)add:(NSString *)threadId body:(NSString *)body error:(NSError **)error;

/**
 * List messages for a thread
 * @param offset The offset to query from
 * @param limit The max number of messages to return
 * @param threadId The id of the thread to query
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return An object containing a list of messages
 */
- (TextList *)list:(nullable NSString *)offset limit:(long)limit threadId:(NSString *)threadId error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
