//
//  TextileDelegate.h
//  Textile
//
//  Created by Aaron Sutula on 3/4/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/Model.pbobjc.h>
#import <TextileCore/View.pbobjc.h>

#ifndef TextileDelegate_h
#define TextileDelegate_h

NS_ASSUME_NONNULL_BEGIN

/**
 * Protocol that can be implemented in order to receive callbacks from Textile about events of interest
 */
@protocol TextileDelegate <NSObject>

@optional
/**
 * Called when the Textile node is started successfully
 */
- (void)nodeStarted;

@optional
/**
 * Called when the Textile node fails to start
 * @param error The error describing the failure
 */
- (void)nodeFailedToStartWithError:(NSError *)error;

@optional
/**
 * Called when the Textile node is successfully stopped
 */
- (void)nodeStopped;

@optional
/**
 * Called when the Textile node fails to stop
 * @param error The error describing the failure
 */
- (void)nodeFailedToStopWithError:(NSError *)error;

@optional
/**
 * Called when the Textile node comes online
 */
- (void)nodeOnline;

@optional
/**
 * Called when the node is scheduled to be stopped in the future
 * @param seconds The amount of time the node will run for before being stopped
 */
- (void)willStopNodeInBackgroundAfterDelay:(NSTimeInterval)seconds;

@optional
/**
 * Called when the scheduled node stop is cancelled, the node will continue running
 */
- (void)canceledPendingNodeStop;

@optional
/**
 * Called when the Textile node receives a notification
 * @param notification The received notification
 */
- (void)notificationReceived:(Notification *)notification;

@optional
/**
 * Called when any thread receives an update
 * @param feedItem The thread update
 */
- (void)threadUpdateReceived:(FeedItem *)feedItem;

@optional
/**
 * Called when a new thread is successfully added
 * @param threadId The id of the newly added thread
 */
- (void)threadAdded:(NSString *)threadId;

@optional
/**
 * Called when a thread is successfully removed
 * @param threadId The id of the removed thread
 */
- (void)threadRemoved:(NSString *)threadId;

@optional
/**
 * Called when a peer node is added to the user account
 * @param peerId The id of the new account peer
 */
- (void)accountPeerAdded:(NSString *)peerId;

@optional
/**
 * Called when an account peer is removed from the user account
 * @param peerId The id of the removed account peer
 */
- (void)accountPeerRemoved:(NSString *)peerId;

@optional
/**
 * Called when any query is complete
 * @param queryId The id of the completed query
 */
- (void)queryDone:(NSString *)queryId;

@optional
/**
 * Called when any query fails
 * @param queryId The id of the failed query
 * @param error The error describing the failure
 */
- (void)queryError:(NSString *)queryId error:(NSError *)error;

@optional
/**
 * Called when there is a thread query result available
 * @param queryId The id of the corresponding query
 * @param thread A thread query result
 */
- (void)clientThreadQueryResult:(NSString *)queryId thread:(Thread *)thread;

@optional
/**
 * Called when there is a contact query result available
 * @param queryId The id of the corresponding query
 * @param contact A contact query result
 */
- (void)contactQueryResult:(NSString *)queryId contact:(Contact *)contact;

@end

NS_ASSUME_NONNULL_END


#endif /* TextileDelegate_h */
