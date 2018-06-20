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

@property (nonatomic, strong) MobileWrapper *node;

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
  if (self.node) {
    resolve(@YES);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_REMAP_METHOD(start, startWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  if([self _start:&error]) {
    resolve(@YES);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_REMAP_METHOD(stop, stopWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  if([self _start:&error]) {
    resolve(@YES);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(signUpWithEmail:(NSString *)username password:(NSString *)password email:(NSString*)email referral:(NSString*)referral resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _signUpWithEmail:username password:password email:email referral:referral error:&error];
  if (error == NULL) {
    resolve(@YES);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(signIn:(NSString *)username password:(NSString *)password resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _signIn:username password:password error:&error];
  if (error == NULL) {
    resolve(@YES);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(signOut:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _signOut:&error];
  if (error == NULL) {
    resolve(@YES);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(isSignedIn) {
  if ([self _isSignedIn]) {
    return @YES;
  } else {
    return @NO;
  }
}

RCT_EXPORT_METHOD(getId:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *nid = [self _getId:&error];
  if (nid) {
    resolve(nid);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getIPFSPeerId:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *pid = [self _getIPFSPeerId:&error];
  if (pid) {
    resolve(pid);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getUserName:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *username = [self _getUsername:&error];
  if (username) {
    resolve(username);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getAccessToken:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *token = [self _getAccessToken:&error];
  if (token) {
    resolve(token);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(addThread:(NSString *)name withMnemonic:(NSString *)mnemonic resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _addThread:name withMnemonic:mnemonic error:&error];
  if (error == NULL) {
    resolve(@YES);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(addPhoto:(NSString *)path toThreadNamed:(NSString *)threadName withCaption:(NSString *)caption resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NetMultipartRequest *multipart = [self _addPhoto:path toThreadNamed:threadName withCaption:caption error:&error];
  if(multipart) {
    resolve(@{ @"payloadPath": multipart.payloadPath, @"boundary": multipart.boundary });
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(sharePhoto:(NSString *)id toThreadNamed:(NSString *)threadName withCaption:(NSString *)caption resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *sid = [self _sharePhoto:id toThreadNamed:threadName withCaption:caption error:&error];
  if(sid) {
    resolve(sid);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getPhotoBlocks:(NSString *)offset limit:(int)limit threadName:(NSString *)thread resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *jsonString = [self _getPhotoBlocks:offset withLimit:limit fromThreadNamed:thread error:&error];
  NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
  id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
  NSArray *items = [json objectForKey:@"items"];
  if (items) {
    resolve(items);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getBlockData:(NSString *)id withPath:(NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getBlockData:id withPath:path error:&error];
  if (result) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getFileData:(NSString *)id withPath:(NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getFileData:id withPath:path error:&error];
  if (result) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(pairDevice:(NSString *)pkb64 resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSError *error;
  NSString *result = [self _pairDevice:pkb64 error:&error];
  if(result) {
    resolve(result);
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
    self.node = [[MobileMobile new] newNode:config messenger:[[Messenger alloc] init] error:error];
  }
}

- (BOOL)_start:(NSError**)error {
  BOOL startNodeSuccess = [self.node start:error];
  return startNodeSuccess;
}

- (BOOL)_stop:(NSError**)error {
  BOOL success = [self.node stop:error];
  return success;
}

- (BOOL)_signUpWithEmail:(NSString *)username password:(NSString*)password email:(NSString*)email referral:(NSString*)referral error:(NSError**)error {
  return [self.node signUpWithEmail:username password:password email:email referral:referral error:error];
}

- (BOOL)_signIn:(NSString *)username password:(NSString*)password error:(NSError**)error {
  return [self.node signIn:username password:password error:error];
}

- (BOOL)_signOut:(NSError**)error {
  return [self.node signOut:error];
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

- (NSString *)_getIPFSPeerId:(NSError**)error {
  return [self.node getIPFSPeerId:error];
}

- (BOOL)_addThread:(NSString *)name withMnemonic:(NSString *)mnemonic error:(NSError**)error {
  return [self.node addThread:name mnemonic:mnemonic error:error];
}

- (NetMultipartRequest *)_addPhoto:(NSString *)path toThreadNamed:(NSString *)threadName withCaption:(NSString *)caption error:(NSError**)error {
  return [self.node addPhoto:path threadName:threadName caption:caption error:error];
}

- (NSString *)_sharePhoto:(NSString *)id toThreadNamed:(NSString *)threadName withCaption:(NSString *)caption error:(NSError**)error {
  return [self.node sharePhoto:id threadName:threadName caption:caption error:error];
}

- (NSString *)_getPhotoBlocks:(NSString *)offset withLimit:(long)limit fromThreadNamed:(NSString *)threadName error:(NSError**)error {
  return [self.node getPhotoBlocks:offset limit:limit threadName:threadName error:error];
}

- (NSString *)_getBlockData:(NSString *)id withPath:(NSString *)path error:(NSError**)error {
  return [self.node getBlockData:id path:path error:error];
}

- (NSString *)_getFileData:(NSString *)id withPath:(NSString *)path error:(NSError**)error {
  return [self.node getFileData:id path:path error:error];
}

- (NSString *)_pairDevice:(NSString *)pkb64 error:(NSError**)error {
  return [self.node pairDevice:pkb64 error:error];
}

@end

@implementation RCTBridge (TextileNode)

- (TextileNode *)textileNode
{
  return [self moduleForClass:[TextileNode class]];
}

@end
