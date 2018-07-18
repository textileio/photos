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

RCT_EXPORT_METHOD(create:(NSString *)dataDir apiUrl:(NSString *)apiUrl logLevel:(NSString *)logLevel logFiles:(BOOL *)logFiles resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _create:dataDir apiUrl:apiUrl logLevel:logLevel logFiles:logFiles error:&error];
  if (!error) {
    resolve(nil);
  } else {
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

RCT_EXPORT_METHOD(signUpWithEmail:(NSString *)username password:(NSString *)password email:(NSString*)email referral:(NSString*)referral resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _signUpWithEmail:username password:password email:email referral:referral error:&error];
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

RCT_EXPORT_METHOD(getId:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *nid = [self _getId:&error];
  if (!error) {
    resolve(nid);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getUserName:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *username = [self _getUsername:&error];
  if (!error) {
    resolve(username);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getAccessToken:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *token = [self _getAccessToken:&error];
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
  [self _removeThread:threadId error:&error];
  if (!error) {
    resolve(nil);
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
  [self _acceptExternalThreadInvite:threadId key:key error:&error];
  if (!error) {
    resolve(nil);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(addPhoto:(NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _addPhoto:path error:&error];
  if(!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}


// Replaces sharePhoto
RCT_EXPORT_METHOD(addPhotoToThread:(NSString *)photoId key:(NSString *)key threadId:(NSString *)threadId caption:(NSString *)caption resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _addPhotoToThread:photoId key:key threadId:threadId caption:caption error:&error];
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

RCT_EXPORT_METHOD(getBlockData:(NSString *)id withPath:(NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getBlockData:id withPath:path error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getPhotoData:(NSString *)id withPath:(NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getPhotoData:id withPath:path error:&error];
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

#pragma mark - Private methods

- (void)_create:(NSString *)dataDir apiUrl:(NSString *)apiUrl logLevel:(NSString *)logLevel logFiles:(BOOL *)logFiles error:(NSError**)error {
  if (!self.node) {
    MobileNodeConfig *config = [[MobileNodeConfig alloc] init];
    [config setRepoPath:dataDir];
    [config setCentralApiURL:apiUrl];
    [config setLogLevel:logLevel];
    [config setLogFiles:logFiles];
    self.node = MobileNewNode(config, [[Messenger alloc] init], error);
  }
}

- (void)_start:(NSError**)error {
  [self.node start:error];
}

- (void)_stop:(NSError**)error {
  [self.node stop:error];
}

- (void)_signUpWithEmail:(NSString *)username password:(NSString*)password email:(NSString*)email referral:(NSString*)referral error:(NSError**)error {
  [self.node signUpWithEmail:username password:password email:email referral:referral error:error];
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

- (NSString *)_getAccessToken:(NSError**)error {
  return [self.node getAccessToken:error];
}

- (NSString *)_getId:(NSError**)error {
  return [self.node getId:error];
}

- (NSString *)_addThread:(NSString *)name withMnemonic:(NSString *)mnemonic error:(NSError**)error {
  return [self.node addThread:name mnemonic:mnemonic error:error];
}

- (void)_removeThread:(NSString *)threadId error:(NSError**)error {
  [self.node removeThread:threadId error:error];
}

- (NSString *)_threads:(NSError**)error {
  return [self.node threads:error];
}

- (NSString *)_addExternalThreadInvite:(NSString *)threadId error:(NSError**)error {
  return [self.node addExternalThreadInvite:threadId error:error];
}

- (void)_acceptExternalThreadInvite:(NSString *)threadId key:(NSString *)key error:(NSError**)error {
  [self.node acceptExternalThreadInvite:threadId key:key error:error];
}

- (NSString *)_addPhoto:(NSString *)photoId error:(NSError**)error {
  return [self.node addPhoto:photoId error:error];
}


- (NSString *)_addPhotoToThread:(NSString *)photoId key:key threadId:(NSString *)threadId caption:(NSString *)caption error:(NSError**)error {
  if (!caption) {
    caption = @"";
  }
  return [self.node addPhotoToThread:photoId key:key threadId:threadId caption:caption error:error];
}

- (NSString *)_getPhotos:(NSString *)offset limit:(long)limit threadId:(NSString *)threadId error:(NSError**)error {
  return [self.node getPhotos:offset limit:limit threadId:threadId error:error];
}

- (NSString *)_getPhotoData:(NSString *)id withPath:(NSString *)path error:(NSError**)error {
  return [self.node getPhotoData:id path:path error:error];
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

@end

@implementation RCTBridge (TextileNode)

- (TextileNode *)textileNode
{
  return [self moduleForClass:[TextileNode class]];
}

@end
