// Objective-C API for talking to github.com/textileio/go-textile/mobile Go package.
//   gobind -lang=objc github.com/textileio/go-textile/mobile
//
// File is generated by gobind. Do not edit.

#ifndef __Mobile_H__
#define __Mobile_H__

@import Foundation;
#include "ref.h"
#include "Universe.objc.h"


@class MobileEvent;
@class MobileInitConfig;
@class MobileMigrateConfig;
@class MobileMobile;
@class MobileRunConfig;
@class MobileSearchHandle;
@protocol MobileCallback;
@class MobileCallback;
@protocol MobileMessenger;
@class MobileMessenger;

@protocol MobileCallback <NSObject>
- (void)call:(NSData* _Nullable)data err:(NSError* _Nullable)err;
@end

@protocol MobileMessenger <NSObject>
- (void)notify:(MobileEvent* _Nullable)event;
@end

/**
 * Event is sent by Messenger to the bridge (data is a protobuf,
name is the string value of a pb.MobileEvent_Type)
 */
@interface MobileEvent : NSObject <goSeqRefInterface> {
}
@property(strong, readonly) id _ref;

- (nonnull instancetype)initWithRef:(id)ref;
- (nonnull instancetype)init;
@property (nonatomic) NSString* _Nonnull name;
@property (nonatomic) int32_t type;
@property (nonatomic) NSData* _Nullable data;
@end

/**
 * InitConfig is used to setup a textile node
 */
@interface MobileInitConfig : NSObject <goSeqRefInterface> {
}
@property(strong, readonly) id _ref;

- (nonnull instancetype)initWithRef:(id)ref;
- (nonnull instancetype)init;
@property (nonatomic) NSString* _Nonnull seed;
@property (nonatomic) NSString* _Nonnull repoPath;
@property (nonatomic) BOOL logToDisk;
@property (nonatomic) BOOL debug;
@end

/**
 * MigrateConfig is used to define options during a major migration
 */
@interface MobileMigrateConfig : NSObject <goSeqRefInterface> {
}
@property(strong, readonly) id _ref;

- (nonnull instancetype)initWithRef:(id)ref;
- (nonnull instancetype)init;
@property (nonatomic) NSString* _Nonnull repoPath;
@end

/**
 * Mobile is the name of the framework (must match package name)
 */
@interface MobileMobile : NSObject <goSeqRefInterface> {
}
@property(strong, readonly) id _ref;

- (nonnull instancetype)initWithRef:(id)ref;
- (nonnull instancetype)init;
@property (nonatomic) NSString* _Nonnull repoPath;
- (NSString* _Nonnull)acceptExternalInvite:(NSString* _Nullable)id_ key:(NSString* _Nullable)key error:(NSError* _Nullable*)error;
/**
 * AcceptInviteViaNotification call core AcceptInviteViaNotification
 */
- (NSString* _Nonnull)acceptInviteViaNotification:(NSString* _Nullable)id_ error:(NSError* _Nullable*)error;
- (NSData* _Nullable)accountPeers:(NSError* _Nullable*)error;
- (NSString* _Nonnull)addComment:(NSString* _Nullable)blockId body:(NSString* _Nullable)body error:(NSError* _Nullable*)error;
- (BOOL)addContact:(NSData* _Nullable)contact error:(NSError* _Nullable*)error;
- (NSData* _Nullable)addExternalInvite:(NSString* _Nullable)threadId error:(NSError* _Nullable*)error;
- (NSData* _Nullable)addFiles:(NSData* _Nullable)dir threadId:(NSString* _Nullable)threadId caption:(NSString* _Nullable)caption error:(NSError* _Nullable*)error;
- (NSData* _Nullable)addFilesByTarget:(NSString* _Nullable)target threadId:(NSString* _Nullable)threadId caption:(NSString* _Nullable)caption error:(NSError* _Nullable*)error;
- (NSString* _Nonnull)addFlag:(NSString* _Nullable)blockId error:(NSError* _Nullable*)error;
- (NSString* _Nonnull)addIgnore:(NSString* _Nullable)blockId error:(NSError* _Nullable*)error;
- (NSString* _Nonnull)addInvite:(NSString* _Nullable)threadId inviteeId:(NSString* _Nullable)inviteeId error:(NSError* _Nullable*)error;
- (NSString* _Nonnull)addLike:(NSString* _Nullable)blockId error:(NSError* _Nullable*)error;
- (NSString* _Nonnull)addMessage:(NSString* _Nullable)threadId body:(NSString* _Nullable)body error:(NSError* _Nullable*)error;
/**
 * AddOrUpdateThread calls core AddOrUpdateThread
 */
- (BOOL)addOrUpdateThread:(NSData* _Nullable)thrd error:(NSError* _Nullable*)error;
/**
 * AddSchema adds a new schema via schema mill
 */
- (NSData* _Nullable)addSchema:(NSData* _Nullable)node error:(NSError* _Nullable*)error;
/**
 * AddThread adds a new thread with the given name
 */
- (NSData* _Nullable)addThread:(NSData* _Nullable)config error:(NSError* _Nullable*)error;
- (NSString* _Nonnull)address;
/**
 * Avatar calls core Avatar
 */
- (NSString* _Nonnull)avatar:(NSError* _Nullable*)error;
- (NSData* _Nullable)cafeSession:(NSString* _Nullable)peerId error:(NSError* _Nullable*)error;
- (NSData* _Nullable)cafeSessions:(NSError* _Nullable*)error;
- (BOOL)checkCafeMessages:(NSError* _Nullable*)error;
- (NSData* _Nullable)contact:(NSString* _Nullable)id_ error:(NSError* _Nullable*)error;
- (NSData* _Nullable)contactThreads:(NSString* _Nullable)id_ error:(NSError* _Nullable*)error;
- (NSData* _Nullable)contacts:(NSError* _Nullable*)error;
/**
 * CountUnreadNotifications calls core CountUnreadNotifications
 */
- (long)countUnreadNotifications;
- (NSData* _Nullable)dataAtPath:(NSString* _Nullable)pth error:(NSError* _Nullable*)error;
- (NSData* _Nullable)decrypt:(NSData* _Nullable)input error:(NSError* _Nullable*)error;
- (BOOL)deregisterCafe:(NSString* _Nullable)peerId error:(NSError* _Nullable*)error;
- (NSData* _Nullable)encrypt:(NSData* _Nullable)input error:(NSError* _Nullable*)error;
- (NSData* _Nullable)feed:(NSData* _Nullable)req error:(NSError* _Nullable*)error;
- (NSString* _Nonnull)fileData:(NSString* _Nullable)hash error:(NSError* _Nullable*)error;
- (NSData* _Nullable)files:(NSString* _Nullable)offset limit:(long)limit threadId:(NSString* _Nullable)threadId error:(NSError* _Nullable*)error;
- (MobileSearchHandle* _Nullable)findThreadBackups:(NSData* _Nullable)query options:(NSData* _Nullable)options error:(NSError* _Nullable*)error;
/**
 * GitSummary returns common GitSummary
 */
- (NSString* _Nonnull)gitSummary;
/**
 * IgnoreInviteViaNotification call core IgnoreInviteViaNotification
 */
- (BOOL)ignoreInviteViaNotification:(NSString* _Nullable)id_ error:(NSError* _Nullable*)error;
- (NSString* _Nonnull)imageFileDataForMinWidth:(NSString* _Nullable)pth minWidth:(long)minWidth error:(NSError* _Nullable*)error;
- (NSData* _Nullable)messages:(NSString* _Nullable)offset limit:(long)limit threadId:(NSString* _Nullable)threadId error:(NSError* _Nullable*)error;
/**
 * Notifications call core Notifications
 */
- (NSData* _Nullable)notifications:(NSString* _Nullable)offset limit:(long)limit error:(NSError* _Nullable*)error;
// skipped method Mobile.OnlineCh with unsupported parameter or return types

- (NSString* _Nonnull)peerId:(NSError* _Nullable*)error;
- (void)prepareFiles:(NSString* _Nullable)data threadId:(NSString* _Nullable)threadId cb:(id<MobileCallback> _Nullable)cb;
- (void)prepareFilesByPath:(NSString* _Nullable)path threadId:(NSString* _Nullable)threadId cb:(id<MobileCallback> _Nullable)cb;
- (NSData* _Nullable)prepareFilesByPathSync:(NSString* _Nullable)path threadId:(NSString* _Nullable)threadId error:(NSError* _Nullable*)error;
- (NSData* _Nullable)prepareFilesSync:(NSString* _Nullable)data threadId:(NSString* _Nullable)threadId error:(NSError* _Nullable*)error;
/**
 * Profile calls core Profile
 */
- (NSData* _Nullable)profile:(NSError* _Nullable*)error;
/**
 * ReadAllNotifications calls core ReadAllNotifications
 */
- (BOOL)readAllNotifications:(NSError* _Nullable*)error;
/**
 * ReadNotification calls core ReadNotification
 */
- (BOOL)readNotification:(NSString* _Nullable)id_ error:(NSError* _Nullable*)error;
- (NSData* _Nullable)refreshCafeSession:(NSString* _Nullable)peerId error:(NSError* _Nullable*)error;
- (BOOL)registerCafe:(NSString* _Nullable)host token:(NSString* _Nullable)token error:(NSError* _Nullable*)error;
- (BOOL)removeContact:(NSString* _Nullable)id_ error:(NSError* _Nullable*)error;
/**
 * RemoveThread call core RemoveThread
 */
- (NSString* _Nonnull)removeThread:(NSString* _Nullable)id_ error:(NSError* _Nullable*)error;
/**
 * RenameThread call core RenameThread
 */
- (BOOL)renameThread:(NSString* _Nullable)id_ name:(NSString* _Nullable)name error:(NSError* _Nullable*)error;
- (MobileSearchHandle* _Nullable)searchContacts:(NSData* _Nullable)query options:(NSData* _Nullable)options error:(NSError* _Nullable*)error;
- (NSString* _Nonnull)seed;
/**
 * SetAvatar calls core SetAvatar
 */
- (BOOL)setAvatar:(NSString* _Nullable)hash error:(NSError* _Nullable*)error;
- (BOOL)setLogLevel:(NSData* _Nullable)level error:(NSError* _Nullable*)error;
/**
 * SetUsername calls core SetUsername
 */
- (BOOL)setUsername:(NSString* _Nullable)username error:(NSError* _Nullable*)error;
/**
 * Start the mobile node
 */
- (BOOL)start:(NSError* _Nullable*)error;
/**
 * Stop the mobile node
 */
- (BOOL)stop:(NSError* _Nullable*)error;
/**
 * Summary calls core Summary
 */
- (NSData* _Nullable)summary:(NSError* _Nullable*)error;
/**
 * Thread calls core Thread
 */
- (NSData* _Nullable)thread:(NSString* _Nullable)threadId error:(NSError* _Nullable*)error;
/**
 * ThreadPeers calls core ThreadPeers
 */
- (NSData* _Nullable)threadPeers:(NSString* _Nullable)id_ error:(NSError* _Nullable*)error;
/**
 * Threads lists all threads
 */
- (NSData* _Nullable)threads:(NSError* _Nullable*)error;
/**
 * Username calls core Username
 */
- (NSString* _Nonnull)username:(NSError* _Nullable*)error;
/**
 * Version returns common Version
 */
- (NSString* _Nonnull)version;
@end

/**
 * RunConfig is used to define run options for a mobile node
 */
@interface MobileRunConfig : NSObject <goSeqRefInterface> {
}
@property(strong, readonly) id _ref;

- (nonnull instancetype)initWithRef:(id)ref;
- (nonnull instancetype)init;
@property (nonatomic) NSString* _Nonnull repoPath;
@property (nonatomic) BOOL debug;
@end

/**
 * SearchHandle is used to cancel an async search request
 */
@interface MobileSearchHandle : NSObject <goSeqRefInterface> {
}
@property(strong, readonly) id _ref;

- (nonnull instancetype)initWithRef:(id)ref;
- (nonnull instancetype)init;
@property (nonatomic) NSString* _Nonnull id_;
/**
 * Cancel is used to cancel the request
 */
- (void)cancel;
@end

/**
 * InitRepo calls core InitRepo
 */
FOUNDATION_EXPORT BOOL MobileInitRepo(MobileInitConfig* _Nullable config, NSError* _Nullable* error);

/**
 * MigrateRepo calls core MigrateRepo
 */
FOUNDATION_EXPORT BOOL MobileMigrateRepo(MobileMigrateConfig* _Nullable config, NSError* _Nullable* error);

/**
 * Create a gomobile compatible wrapper around Textile
 */
FOUNDATION_EXPORT MobileMobile* _Nullable MobileNewTextile(MobileRunConfig* _Nullable config, id<MobileMessenger> _Nullable messenger, NSError* _Nullable* error);

/**
 * NewWallet creates a brand new wallet and returns its recovery phrase
 */
FOUNDATION_EXPORT NSString* _Nonnull MobileNewWallet(long wordCount, NSError* _Nullable* error);

/**
 * WalletAccountAt derives the account at the given index
 */
FOUNDATION_EXPORT NSData* _Nullable MobileWalletAccountAt(NSString* _Nullable phrase, long index, NSString* _Nullable password, NSError* _Nullable* error);

@class MobileCallback;

@class MobileMessenger;

/**
 * Callback is used for asyc methods (data is a protobuf)
 */
@interface MobileCallback : NSObject <goSeqRefInterface, MobileCallback> {
}
@property(strong, readonly) id _ref;

- (instancetype)initWithRef:(id)ref;
- (void)call:(NSData* _Nullable)data err:(NSError* _Nullable)err;
@end

/**
 * Messenger is a push mechanism to the bridge
 */
@interface MobileMessenger : NSObject <goSeqRefInterface, MobileMessenger> {
}
@property(strong, readonly) id _ref;

- (instancetype)initWithRef:(id)ref;
- (void)notify:(MobileEvent* _Nullable)event;
@end

#endif
