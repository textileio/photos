//
//  TextileApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/8/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TextileDelegate.h"
#import "AccountApi.h"
#import "CafesApi.h"
#import "CommentsApi.h"
#import "ContactsApi.h"
#import "FeedApi.h"
#import "FilesApi.h"
#import "FlagsApi.h"
#import "IgnoresApi.h"
#import "InvitesApi.h"
#import "IpfsApi.h"
#import "LikesApi.h"
#import "LogsApi.h"
#import "MessagesApi.h"
#import "NotificationsApi.h"
#import "ProfileApi.h"
#import "SchemasApi.h"
#import "ThreadsApi.h"

NS_ASSUME_NONNULL_BEGIN

@interface Textile : NSObject

+ (nullable NSString *)initializeWithDebug:(BOOL)debug logToDisk:(BOOL)logToDisk error:(NSError **)error;
+ (Textile *)instance;

@property (nonatomic, strong, nullable) id<TextileDelegate> delegate;

@property (nonatomic, readonly, strong) AccountApi *account;
@property (nonatomic, readonly, strong) CafesApi  *cafes;
@property (nonatomic, readonly, strong) CommentsApi *comments;
@property (nonatomic, readonly, strong) ContactsApi *contacts;
@property (nonatomic, readonly, strong) FeedApi *feed;
@property (nonatomic, readonly, strong) FilesApi *files;
@property (nonatomic, readonly, strong) FlagsApi *flags;
@property (nonatomic, readonly, strong) IgnoresApi *ignores;
@property (nonatomic, readonly, strong) InvitesApi *invites;
@property (nonatomic, readonly, strong) IpfsApi *ipfs;
@property (nonatomic, readonly, strong) LikesApi *likes;
@property (nonatomic, readonly, strong) LogsApi *logs;
@property (nonatomic, readonly, strong) MessagesApi *messages;
@property (nonatomic, readonly, strong) NotificationsApi *notifications;
@property (nonatomic, readonly, strong) ProfileApi *profile;
@property (nonatomic, readonly, strong) SchemasApi *schemas;
@property (nonatomic, readonly, strong) ThreadsApi *threads;
@property (nonatomic, readonly, strong) NSString *repoPath;

- (NSString *)version;
- (NSString *)gitSummary;
- (Summary *)summary:(NSError **)error;
- (void)destroy:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
