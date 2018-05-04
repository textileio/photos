//  Created by react-native-create-bridge

#import "TextileIPFS.h"
#import <Mobile/Mobile.h>

// import RCTBridge
#if __has_include(<React/RCTBridge.h>)
#import <React/RCTBridge.h>
#elif __has_include(“RCTBridge.h”)
#import “RCTBridge.h”
#else
#import “React/RCTBridge.h” // Required when used as a Pod in a Swift project
#endif

// import RCTEventDispatcher
#if __has_include(<React/RCTEventDispatcher.h>)
#import <React/RCTEventDispatcher.h>
#elif __has_include(“RCTEventDispatcher.h”)
#import “RCTEventDispatcher.h”
#else
#import “React/RCTEventDispatcher.h” // Required when used as a Pod in a Swift project
#endif

@interface TextileIPFS()

@property (nonatomic, strong) MobileWrapper *node;

@end

@implementation TextileIPFS

// Export a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html
RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
  return dispatch_queue_create("io.textile.TextileIPFSQueue", DISPATCH_QUEUE_SERIAL);
}

// Export methods to a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html

RCT_EXPORT_METHOD(createNodeWithDataDir:(NSString *)dataDir resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _createNodeWithDataDir:dataDir error:&error];
  if (self.node) {
    resolve(@YES);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_REMAP_METHOD(startNode, startNodeWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  BOOL success = [self _startNode:&error];
  if(success) {
    resolve(@YES);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_REMAP_METHOD(stopNode, stopNodeWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  BOOL success = [self _stopNode:&error];
  if(success) {
    resolve(@YES);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(addImageAtPath:(NSString *)path thumbPath:(NSString *)thumbPath thread:(NSString *)thread resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NetMultipartRequest *multipart = [self _addPhoto:path thumbPath:thumbPath toThread:thread error:&error];
  if(multipart) {
    resolve(@{ @"payloadPath": multipart.payloadPath, @"boundary": multipart.boundary });
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(sharePhoto:(NSString *)hash thread:(NSString *)thread resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NetMultipartRequest *multipart = [self _sharePhoto:hash toThread:thread error:&error];
  if(multipart) {
    resolve(@{ @"payloadPath": multipart.payloadPath, @"boundary": multipart.boundary });
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getPhotos:(NSString *)offset limit:(int)limit thread:(NSString *)thread resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *hashesString = [self _getPhotosFromOffset:offset withLimit:limit fromThread:thread error:&error];
  NSData *data = [hashesString dataUsingEncoding:NSUTF8StringEncoding];
  id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
  NSArray *hashes = [json objectForKey:@"hashes"];
  if (hashes) {
    resolve(hashes);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(syncGetPhotoData:(NSString *)path) {
  NSError *error;
  NSString *result = [self _getPhoto:path error:&error];
  if (!error && result) {
    return result;
  } else {
    return nil;
  }
}

RCT_EXPORT_METHOD(getPhotoData:(NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getPhoto:path error:&error];
  if (result) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(pairNewDevice:(NSString *)pkb64 resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSError *error;
  NSString *result = [self _pairNewDevice:pkb64 error:&error];
  if(result) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(signIn:(NSString *)username password:(NSString *)password resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSData *jsonData = [self _signIn:username password:password error:&error];
  if(jsonData) {
    NSString * response = [[NSString alloc] initWithData:jsonData
                                                encoding:NSUTF8StringEncoding];
    resolve(response);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(signUpWithEmail:(NSString *)username password:(NSString *)password email:(NSString*)email referral:(NSString*)referral resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSData *jsonData = [self _signUpWithEmail:username password:password email:email referral:referral error:&error];
  if(jsonData) {
    NSString * response = [[NSString alloc] initWithData:jsonData
                                                encoding:NSUTF8StringEncoding];
    resolve(response);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

// List all your events here
// https://facebook.github.io/react-native/releases/next/docs/native-modules-ios.html#sending-events-to-javascript
- (NSArray<NSString *> *)supportedEvents
{
  return @[];
}

#pragma mark - Private methods

- (void)_createNodeWithDataDir:(NSString *)dataDir error:(NSError**)error {
  if (!self.node) {
    self.node = [[MobileMobile new] newNode:dataDir error:error];
  }
}

- (BOOL)_startNode:(NSError**)error {
  BOOL startNodeSuccess = [self.node start:error];
  return startNodeSuccess;
}

- (BOOL)_stopNode:(NSError**)error {
  BOOL success = [self.node stop:error];
  return success;
}

- (NetMultipartRequest *)_addPhoto:(NSString *)path thumbPath:(NSString *)thumbPath toThread:(NSString *)thread error:(NSError**)error {
  NetMultipartRequest *multipart = [self.node addPhoto:path thumb:thumbPath thread:thread error:error];
  return multipart;
}

- (NetMultipartRequest *)_sharePhoto:(NSString *)hash toThread:(NSString *)thread error:(NSError**)error {
  NetMultipartRequest *multipart = [self.node sharePhoto:hash thread:thread error:error];
  return multipart;
}

- (NSString *)_getPhotosFromOffset:(NSString *)offset withLimit:(long)limit fromThread:(NSString *)thread error:(NSError**)error {
  NSString *hashesString = [self.node getPhotos:offset limit:limit thread:thread error:error];
  return hashesString;
}

- (NSString *)_getPhoto:(NSString *)hashPath error:(NSError**)error {
  NSString *base64String = [self.node getFileBase64:hashPath error:error];
  return base64String;
}

- (NSString *)_pairNewDevice:(NSString *)pkb64 error:(NSError**)error {
  NSString *resultString = [self.node pairDesktop:pkb64 error:error];
  return resultString;
}

- (NSData *)_signUpWithEmail:(NSString *)username password:(NSString*)password email:(NSString*)email referral:(NSString*)referral error:(NSError**)error {
  NSString *response = [self.node signUpWithEmail:username password:password email:email referral:referral error:error];
  NSData *jsonData = [response dataUsingEncoding:NSUTF8StringEncoding];
  return jsonData;
}

- (NSData *)_signIn:(NSString *)username password:(NSString*)password error:(NSError**)error {
  NSString *response = [self.node signIn:username password:password error:error];
  NSData *jsonData = [response dataUsingEncoding:NSUTF8StringEncoding];
  return jsonData;
}

// Implement methods that you want to export to the native module
- (void) emitMessageToRN: (NSString *)eventName :(NSDictionary *)params {
  // The bridge eventDispatcher is used to send events from native to JS env
  // No documentation yet on DeviceEventEmitter: https://github.com/facebook/react-native/issues/2819
  [self sendEventWithName: eventName body: params];
}

@end
