//  Created by react-native-create-bridge

#import "TextileNode.h"
#import "Events.h"
#import <Mobile/Mobile.h>

// import RCTBridge
#if __has_include(<React/RCTBridge.h>)
#import <React/RCTBridge.h>
#elif __has_include(“RCTBridge.h”)
#import “RCTBridge.h”
#else
#import “React/RCTBridge.h” // Required when used as a Pod in a Swift project
#endif

@interface Messenger : NSObject<MobileMessenger>
// Define class properties here with @property
@end

@interface Messenger()

@end

@implementation Messenger

- (void) notify: (MobileEvent *)event {
  [Events emitEventWithName:event.name andPayload:event.payload];
}

@end

@interface TextileNode()

@property (nonatomic, strong) MobileMobile *node;

@end

@implementation TextileNode

// Export a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html
RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
  return dispatch_queue_create("io.textile.TextileNodeQueue", DISPATCH_QUEUE_SERIAL);
}

// Export methods to a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html

RCT_EXPORT_METHOD(create:(NSString *)dataDir cafeUrl:(NSString *)cafeUrl logLevel:(NSString *)logLevel logFiles:(BOOL *)logFiles resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _create:dataDir cafeUrl:cafeUrl logLevel:logLevel logFiles:logFiles error:&error];
  if (!error) {
    resolve(nil);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_REMAP_METHOD(mnemonic, mnemonicWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSString *mnemonic = [self _mnemonic];
  if (mnemonic.length > 0) {
    resolve(mnemonic);
  } else {
    NSDictionary *userInfo = @{
                               NSLocalizedDescriptionKey: @"Mnemonic unavailable.",
                               NSLocalizedFailureReasonErrorKey: @"The mnemonic is only availble immediately after starting the node.",
                               NSLocalizedRecoverySuggestionErrorKey: @"Only query for mnemonic immediately after starting the node."
                               };
    NSError *error = [NSError errorWithDomain:@"Textile" code:0 userInfo:userInfo];
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_REMAP_METHOD(start, startWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _start:&error];
  if (!error) {
    resolve(nil);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_REMAP_METHOD(stop, stopWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _stop:&error];
  if (!error) {
    resolve(nil);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(signUpWithEmail:(NSString *)email username:(NSString*)username password:(NSString *)password referral:(NSString*)referral resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _signUpWithEmail:email username:username password:password referral:referral error:&error];
  if (!error) {
    resolve(nil);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(signIn:(NSString *)username password:(NSString *)password resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _signIn:username password:password error:&error];
  if (!error) {
    resolve(nil);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(signOut:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _signOut:&error];
  if (!error) {
    resolve(nil);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(isSignedIn:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if ([self _isSignedIn]) {
    resolve(@YES);
  } else {
    resolve(@NO);
  }
}

RCT_EXPORT_METHOD(setAvatarId:(NSString *)photoId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _setAvatarId:photoId error:&error];
  if (!error) {
    resolve(nil);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getProfile:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getProfile:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getPeerProfile:(NSString *)peerId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getPeerProfile:peerId error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getId:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *nid = [self _getId:&error];
  if (!error) {
    resolve(nid);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getUsername:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *username = [self _getUsername:&error];
  if (!error) {
    resolve(username);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getTokens:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *token = [self _getTokens:&error];
  if (!error) {
    resolve(token);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(addThread:(NSString *)name withMnemonic:(NSString *)mnemonic resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _addThread:name withMnemonic:mnemonic error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(removeThread:(NSString *)threadId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *blockId = [self _removeThread:threadId error:&error];
  if (!error) {
    resolve(blockId);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_REMAP_METHOD(threads, threadsWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *jsonString = [self _threads:&error];
  if (!error) {
    resolve(jsonString);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(addThreadInvite:(NSString *)threadId inviteeKey:(NSString *)inviteeKey resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _addThreadInvite:threadId inviteeKey:inviteeKey error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(addExternalThreadInvite:(NSString *)threadId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _addExternalThreadInvite:threadId error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(acceptExternalThreadInvite:(NSString *)threadId key:(NSString *)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *blockId = [self _acceptExternalThreadInvite:threadId key:key error:&error];
  if (!error) {
    resolve(blockId);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

// Adds a photo to ipfs
RCT_EXPORT_METHOD(addPhoto:(NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _addPhoto:path error:&error];
  if(!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(addPhotoToThread:(NSString *)photoId key:(NSString *)key threadId:(NSString *)threadId caption:(NSString *)caption resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _addPhotoToThread:photoId key:key threadId:threadId caption:caption error:&error];
  if(!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(sharePhotoToThread:(NSString *)photoId threadId:(NSString *)threadId caption:(NSString *)caption resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _sharePhotoToThread:photoId threadId:threadId caption:caption error:&error];
  if(!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getPhotos:(NSString *)offset limit:(int)limit threadId:(NSString *)threadId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *jsonString = [self _getPhotos:offset limit:limit threadId:threadId error:&error];
  if (!error) {
    resolve(jsonString);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getPhotoData:(NSString *)photoId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getPhotoData:photoId error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getThumbData:(NSString *)photoId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getThumbData:photoId error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getPhotoMetadata:(NSString *)photoId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getPhotoMetadata:photoId error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}


RCT_EXPORT_METHOD(getPhotoThreads:(NSString *)photoId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getPhotoThreads:photoId error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getPhotKey:(NSString *)photoId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getPhotoKey:photoId error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(addDevice:(NSString *)name pubKey:(NSString *)pkb64 resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSError *error;
  [self _addDevice:name pubKey:pkb64 error:&error];
  if(!error) {
    resolve(nil);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(removeDevice:(NSString *)deviceId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSError *error;
  [self _removeDevice:deviceId error:&error];
  if(!error) {
    resolve(nil);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_REMAP_METHOD(devices, devicesWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *jsonString = [self _devices:&error];
  if (!error) {
    resolve(jsonString);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_REMAP_METHOD(refreshMessages, refreshMessagesWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _refreshMessages:&error];
  if (!error) {
    resolve(nil);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

#pragma mark - Private methods

- (void)_create:(NSString *)dataDir cafeUrl:(NSString *)cafeUrl logLevel:(NSString *)logLevel logFiles:(BOOL *)logFiles error:(NSError**)error {
  if (!self.node) {
    MobileNodeConfig *config = [[MobileNodeConfig alloc] init];
    [config setRepoPath:dataDir];
    [config setCafeAddr:cafeUrl];
    [config setLogLevel:logLevel];
    [config setLogFiles:logFiles];
    self.node = MobileNewNode(config, [[Messenger alloc] init], error);
  }
}

- (NSString *)_mnemonic {
  return self.node.mnemonic;
}

- (void)_start:(NSError**)error {
  [self.node start:error];
}

- (void)_stop:(NSError**)error {
  [self.node stop:error];
}

- (void)_signUpWithEmail:(NSString *)email username:(NSString*)username password:(NSString*)password referral:(NSString*)referral error:(NSError**)error {
  [self.node signUpWithEmail:email username:username password:password referral:referral error:error];
}

- (void)_signIn:(NSString *)username password:(NSString*)password error:(NSError**)error {
  [self.node signIn:username password:password error:error];
}

- (void)_signOut:(NSError**)error {
  [self.node signOut:error];
}

- (BOOL)_isSignedIn {
  return [self.node isSignedIn];
}

- (NSString *)_getUsername:(NSError**)error {
  return [self.node getUsername:error];
}

- (NSString *)_getTokens:(NSError**)error {
  return [self.node getTokens:error];
}

- (NSString *)_getId:(NSError**)error {
  return [self.node getId:error];
}

- (void)_setAvatarId:(NSString *)id error:(NSError**)error {
  [self.node setAvatarId:id error:error];
}

- (NSString *)_getProfile:(NSError**)error {
  return [self.node getProfile:error];
}

- (NSString *)_getPeerProfile:(NSString *)peerId error:(NSError**)error {
  return [self.node getPeerProfile:peerId error:error];
}

- (NSString *)_addThread:(NSString *)name withMnemonic:(NSString *)mnemonic error:(NSError**)error {
  return [self.node addThread:name mnemonic:mnemonic error:error];
}

- (NSString *)_threads:(NSError**)error {
  return [self.node threads:error];
}

- (NSString *)_addThreadInvite:(NSString *)threadId inviteeKey:(NSString *)inviteeKey error:(NSError**)error {
  return [self.node addThreadInvite:threadId inviteePk:inviteeKey error:error];
}

- (NSString *)_addExternalThreadInvite:(NSString *)threadId error:(NSError**)error {
  return [self.node addExternalThreadInvite:threadId error:error];
}

- (NSString *)_acceptExternalThreadInvite:(NSString *)threadId key:(NSString *)key error:(NSError**)error {
  return [self.node acceptExternalThreadInvite:threadId key:key error:error];
}

- (NSString *)_removeThread:(NSString *)threadId error:(NSError**)error {
  return [self.node removeThread:threadId error:error];
}

- (NSString *)_addPhoto:(NSString *)path error:(NSError**)error {
  return [self.node addPhoto:path error:error];
}

- (NSString *)_addPhotoToThread:(NSString *)photoId key:key threadId:(NSString *)threadId caption:(NSString *)caption error:(NSError**)error {
  if (!caption) {
    caption = @"";
  }
  return [self.node addPhotoToThread:photoId key:key threadId:threadId caption:caption error:error];
}

- (NSString *)_sharePhotoToThread:(NSString *)photoId threadId:(NSString *)threadId caption:(NSString *)caption error:(NSError**)error {
  if (!caption) {
    caption = @"";
  }
  return [self.node sharePhotoToThread:photoId threadId:threadId caption:caption error:error];
}

- (NSString *)_getPhotos:(NSString *)offset limit:(long)limit threadId:(NSString *)threadId error:(NSError**)error {
  return [self.node getPhotos:offset limit:limit threadId:threadId error:error];
}

- (NSString *)_getPhotoData:(NSString *)photoId error:(NSError**)error {
  return [self.node getPhotoData:photoId error:error];
}

- (NSString *)_getThumbData:(NSString *)photoId error:(NSError**)error {
  return [self.node getThumbData:photoId error:error];
}

- (NSString *)_getPhotoMetadata:(NSString *)photoId error:(NSError**)error {
  return [self.node getPhotoMetadata:photoId error:error];
}

- (NSString *)_getPhotoThreads:(NSString *)photoId error:(NSError**)error {
  return [self.node photoThreads:photoId error:error];
}

- (NSString *)_getPhotoKey:(NSString *)photoId error:(NSError**)error {
  return [self.node getPhotoKey:photoId error:error];
}

- (void)_addDevice:(NSString *)name pubKey:(NSString *)pkb64 error:(NSError**)error {
  [self.node addDevice:name pubKey:pkb64 error:error];
}

- (void)_removeDevice:(NSString *)deviceId error:(NSError**)error {
  [self.node removeDevice:deviceId error:error];
}

- (NSString *)_devices:(NSError**)error {
  return [self.node devices:error];
}

- (void)_refreshMessages:(NSError**)error {
  [self.node refreshMessages:error];
}

@end

@implementation RCTBridge (TextileNode)

- (TextileNode *)textileNode
{
  return [self moduleForClass:[TextileNode class]];
}

@end
