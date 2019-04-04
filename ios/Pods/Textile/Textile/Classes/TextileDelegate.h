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

@protocol TextileDelegate <NSObject>

@optional
- (void)nodeStarted;

@optional
- (void)nodeFailedToStartWithError:(NSError *)error;

@optional
- (void)nodeStopped;

@optional
- (void)nodeFailedToStopWithError:(NSError *)error;

@optional
- (void)nodeOnline;

@optional
- (void)willStopNodeInBackgroundAfterDelay:(NSTimeInterval)seconds;

@optional
- (void)canceledPendingNodeStop;

@optional
- (void)notificationReceived:(Notification *)notification;

@optional
- (void)threadUpdateReceived:(FeedItem *)feedItem;

@optional
- (void)threadAdded:(NSString *)threadId;

@optional
- (void)threadRemoved:(NSString *)threadId;

@optional
- (void)accountPeerAdded:(NSString *)peerId;

@optional
- (void)accountPeerRemoved:(NSString *)peerId;

@optional
- (void)queryDone:(NSString *)queryId;

@optional
- (void)queryError:(NSString *)queryId error:(NSError *)error;

@optional
- (void)clientThreadQueryResult:(NSString *)queryId thread:(Thread *)thread;

@optional
- (void)contactQueryResult:(NSString *)queryId contact:(Contact *)contact;

@end

NS_ASSUME_NONNULL_END


#endif /* TextileDelegate_h */
