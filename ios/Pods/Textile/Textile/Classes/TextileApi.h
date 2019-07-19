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

extern  NSString* _Nonnull const TEXTILE_BACKGROUND_SESSION_ID;

NS_ASSUME_NONNULL_BEGIN

/**
 * Provides top level access to the Textile API
 */
@interface Textile : NSObject

/**
 * Create a new Textile wallet
 * @param wordCount The number of words the wallet recovery phrase should contain
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The new wallet recovery phrase
 */
+ (NSString *)newWallet:(NSInteger)wordCount error:(NSError **)error;

/**
 * Resolve a wallet account
 * @param phrase The wallet recovery phrase
 * @param index The index of the account to resolve
 * @param password The wallet password or nil if there is no password
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The wallet account
 */
+ (MobileWalletAccount *)walletAccountAt:(NSString *)phrase index:(NSInteger)index password:(NSString *)password error:(NSError **)error;

/**
 * Check if Textile is already initialized
 * @param repoPath The path to the Textile repo
 * @return A boolean value indicating if Textile is initialized or not
 */
+ (BOOL)isInitialized:(NSString *)repoPath;

/**
 * Initialize the shared Textile instance with an existing account seed
 * @param repoPath The path to the Textile repo
 * @param seed The account seed
 * @param debug Sets the log level to debug or not
 * @param logToDisk Whether or not to write Textile logs to disk
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return A boolean value indicating if Textile was initialized successfully
 */
+ (BOOL)initialize:(NSString *)repoPath seed:(NSString *)seed debug:(BOOL)debug logToDisk:(BOOL)logToDisk error:(NSError **)error;

/**
 * Initialize the shared Textile instance, creating a new wallet
 * @param repoPath The path to the Textile repo
 * @param debug Sets the log level to debug or not
 * @param logToDisk Whether or not to write Textile logs to disk
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The wallet recovery phrase or nil if there was an error
 */
+ (NSString *)initializeCreatingNewWalletAndAccount:(NSString *)repoPath debug:(BOOL)debug logToDisk:(BOOL)logToDisk error:(NSError **)error;

/**
 * After initialization is complete, launch Textile
 * @param repoPath The path to the Textile repo
 * @param debug Sets the log level to debug or not
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return A boolean value indicating if Textile was launched successfully
 */
+ (BOOL)launch:(NSString *)repoPath debug:(BOOL)debug error:(NSError **)error;

/**
 * The shared Textile instance, should be used for all Textile API access
 */
+ (Textile *)instance;

/**
 * The delegate object that can be set to receive callbacks about different Textile events
 */
@property (nonatomic, strong, nullable) id<TextileDelegate> delegate;

/**
 * Provides access to Textile account related APIs
 */
@property (nonatomic, readonly, strong) AccountApi *account;

/**
 * Provides access to Textile cafes related APIs
 */
@property (nonatomic, readonly, strong) CafesApi  *cafes;

/**
 * Provides access to Textile comments related APIs
 */
@property (nonatomic, readonly, strong) CommentsApi *comments;

/**
 * Provides access to Textile contacts related APIs
 */
@property (nonatomic, readonly, strong) ContactsApi *contacts;

/**
 * Provides access to Textile feed related APIs
 */
@property (nonatomic, readonly, strong) FeedApi *feed;

/**
 * Provides access to Textile files related APIs
 */
@property (nonatomic, readonly, strong) FilesApi *files;

/**
 * Provides access to Textile flags related APIs
 */
@property (nonatomic, readonly, strong) FlagsApi *flags;

/**
 * Provides access to Textile ignores related APIs
 */
@property (nonatomic, readonly, strong) IgnoresApi *ignores;

/**
 * Provides access to Textile invites related APIs
 */
@property (nonatomic, readonly, strong) InvitesApi *invites;

/**
 * Provides access to Textile IPFS related APIs
 */
@property (nonatomic, readonly, strong) IpfsApi *ipfs;

/**
 * Provides access to Textile likes related APIs
 */
@property (nonatomic, readonly, strong) LikesApi *likes;

/**
 * Provides access to Textile logs related APIs
 */
@property (nonatomic, readonly, strong) LogsApi *logs;

/**
 * Provides access to Textile messages related APIs
 */
@property (nonatomic, readonly, strong) MessagesApi *messages;

/**
 * Provides access to Textile notifications related APIs
 */
@property (nonatomic, readonly, strong) NotificationsApi *notifications;

/**
 * Provides access to Textile profile related APIs
 */
@property (nonatomic, readonly, strong) ProfileApi *profile;

/**
 * Provides access to Textile schemas related APIs
 */
@property (nonatomic, readonly, strong) SchemasApi *schemas;

/**
 * Provides access to Textile threads related APIs
 */
@property (nonatomic, readonly, strong) ThreadsApi *threads;

@property (nonatomic, copy, nullable) void (^backgroundCompletionHandler)(void);

/**
 * @return The version of the Textile node running locally
 */
- (NSString *)version;

/**
 * @return The git summary of the Textile node running locally
 */
- (NSString *)gitSummary;

/**
 * Get a summary of the local Textile node and it's data
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return A summary of the Textile node running locally
 */
- (Summary *)summary:(NSError **)error;

/**
 * Reset the local Textile node instance so it can be re-initialized
 * @param error A reference to an error pointer that will be set in the case of an error
 */
- (void)destroy:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
