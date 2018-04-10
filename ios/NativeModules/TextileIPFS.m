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

// Export constants
// https://facebook.github.io/react-native/releases/next/docs/native-modules-ios.html#exporting-constants
- (NSDictionary *)constantsToExport {
  return @{
           @"EXAMPLE": @"example"
           };
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

RCT_EXPORT_METHOD(addImageAtPath:(NSString *)path thumbPath:(NSString *)thumbPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NetMultipartRequest *multipart = [self _addPhoto:path thumbPath:thumbPath error:&error];
  if(multipart) {
    resolve(@{ @"payloadPath": multipart.payloadPath, @"boundary": multipart.boundary });
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getPhotos:(NSString *)offset limit:(int)limit resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *hashesString = [self _getPhotosFromOffset:offset withLimit:limit error:&error];
  if (hashesString) {
    resolve(hashesString);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
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

- (BOOL)_configureNodeWithMnemonic:(NSString *)mnemonic error:(NSError**)error {
  BOOL success = [self.node configureDatastore:mnemonic error:error];
  return success;
}

- (BOOL)_startNode:(NSError**)error {
  BOOL startNodeSuccess = [self.node start:error];
  BOOL configureSuccess = YES;
  if (startNodeSuccess && ![self.node isDatastoreConfigured]) {
    configureSuccess = [self.node configureDatastore:@"" error:error];
  }
  return startNodeSuccess && configureSuccess;
}

- (BOOL)_stopNode:(NSError**)error {
  BOOL success = [self.node stop:error];
  return success;
}

- (NetMultipartRequest *)_addPhoto:(NSString *)path thumbPath:(NSString *)thumbPath error:(NSError**)error {
  NetMultipartRequest *multipart = [self.node addPhoto:path thumb:thumbPath error:error];
  return multipart;
}

- (NSString *)_getPhotosFromOffset:(NSString *)offset withLimit:(long)limit error:(NSError**)error {
  NSString *hashesString = [self.node getPhotos:offset limit:limit error:error];
  return hashesString;
}

- (NSString *)_getPhoto:(NSString *)hashPath error:(NSError**)error {
  NSString *base64String = [self.node getFileBase64:hashPath error:error];
  return base64String;
}

// Implement methods that you want to export to the native module
- (void) emitMessageToRN: (NSString *)eventName :(NSDictionary *)params {
  // The bridge eventDispatcher is used to send events from native to JS env
  // No documentation yet on DeviceEventEmitter: https://github.com/facebook/react-native/issues/2819
  [self sendEventWithName: eventName body: params];
}

@end
