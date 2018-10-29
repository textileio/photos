//  Created by react-native-create-bridge

#import "TextileNode.h"
#import "Events.h"
#import <Mobile/Mobile.h>
#import <Photos/Photos.h>

// import RCTBridge
#if __has_include(<React/RCTBridge.h>)
#import <React/RCTBridge.h>
#elif __has_include(“RCTBridge.h”)
#import “RCTBridge.h”
#else
#import “React/RCTBridge.h” // Required when used as a Pod in a Swift project
#endif

#define SYSTEM_VERSION_LESS_THAN(v) ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedAscending)

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

// Export method for local photo selection

RCT_EXPORT_METHOD(requestLocalPhotos:(int)minEpoch resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSTimeInterval seconds = minEpoch;
  NSDate *epochNSDate = [[NSDate alloc] initWithTimeIntervalSince1970:seconds];

  PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatus];
  if (status == PHAuthorizationStatusAuthorized)
  {
    //initialize empty local state
    @autoreleasepool
    {
      //fetch all the albums
      PHFetchOptions *onlyImagesOptions = [PHFetchOptions new];
      // Limit to only photo media types
      // NSPredicate *mediaPhotos = [NSPredicate predicateWithFormat:@"mediaType = %i", PHAssetMediaTypeImage];
      // Limit to only photos modified later than or equal to our specified date
      NSPredicate *minDate = [NSPredicate predicateWithFormat:@"modificationDate > %@", epochNSDate];
      // Limit to camera roll?
      // NSPredicate *cameraRoll = [NSPredicate predicateWithFormat:@"modificationDate > %@", epochNSDate];
      onlyImagesOptions.predicate = minDate;
      // Combine the multiple predicates (didn't seem to work combining them like this)
      // [NSCompoundPredicate orPredicateWithSubpredicates:@[mediaPhotos, minDate]];
      // Not sure we really need to do the sort... but here it is
      onlyImagesOptions.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"modificationDate" ascending:YES]];

      PHFetchResult *allPhotosResult = [PHAsset fetchAssetsWithMediaType:PHAssetMediaTypeImage options:onlyImagesOptions];
      [allPhotosResult enumerateObjectsUsingBlock:^(PHAsset *asset, NSUInteger idx, BOOL *stop) {

        // Get the original filename to keep it straight on the system.
        // Alternatively could probably just use timestamp, but this doesn't seem to have any lag
        NSArray *resources = [PHAssetResource assetResourcesForAsset:asset];


        NSString *orgFilename = ((PHAssetResource*)resources[0]).originalFilename;
        NSString *extension = [orgFilename pathExtension];

        // Check that this isn't a metadata edit only. adjustmentTimestamp should be pixel changes
        NSDate *adjDate = [asset valueForKey:@"adjustmentTimestamp"];
        // Grab the first creation date for the photo file
        NSDate *creDate = [asset valueForKey:@"creationDate"];
        if (adjDate != nil && [epochNSDate timeIntervalSinceDate:adjDate] > 0 ) {
          // if adjustmentTimestamp is less than our filter, we should return
          return;
        } else if (adjDate == nil && [epochNSDate timeIntervalSinceDate:creDate] > 0) {
          // if creation timestamp is less than our filter and the image has never been modified, return
          return;
        } else if ( [extension caseInsensitiveCompare:@"heic"] == NSOrderedSame ) {
          [self _processHEIC:asset orgFilename:orgFilename];
        } else {
          [self _processJPG:asset orgFilename:orgFilename];
        }
      }];
    }
  }
  resolve(@YES);
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

RCT_EXPORT_METHOD(getPubKey:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *pk = [self _getPubKey:&error];
  if (!error) {
    resolve(pk);
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

RCT_EXPORT_METHOD(getTokens:(BOOL *)force resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *token = [self _getTokens:force error:&error];
  if (!error) {
    resolve(token);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getOverview:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *overview = [self _getOverview:&error];
  if (!error) {
    resolve(overview);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(addThread:(NSString *)name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _addThread:name error:&error];
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

RCT_EXPORT_METHOD(addThreadInvite:(NSString *)threadId inviteePk:(NSString *)inviteePk resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _addThreadInvite:threadId inviteePk:inviteePk error:&error];
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

RCT_EXPORT_METHOD(getPhotoData:(NSString *)photoId path:(NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getPhotoData:photoId path:path error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}


RCT_EXPORT_METHOD(getPhotoDataForMinWidth:(NSString *)photoId minWidth:(int)minWidth resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getPhotoDataForMinWidth:photoId minWidth:minWidth error:&error];
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

RCT_EXPORT_METHOD(getPhotoKey:(NSString *)photoId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _getPhotoKey:photoId error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}


RCT_EXPORT_METHOD(ignorePhoto:(NSString *)blockId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _ignorePhoto:blockId error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(addPhotoComment:(NSString *)blockId body:(NSString *)body resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _addPhotoComment:blockId body:body error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(ignorePhotoComment:(NSString *)blockId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _ignorePhotoComment:blockId error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}


RCT_EXPORT_METHOD(addPhotoLike:(NSString *)blockId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _addPhotoLike:blockId error:&error];
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(ignorePhotoLike:(NSString *)blockId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _ignorePhotoLike:blockId error:&error];
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

RCT_EXPORT_METHOD(getNotifications:(NSString *)offset limit:(int)limit resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *jsonString = [self _getNotifications:offset limit:limit error:&error];
  if (!error) {
    resolve(jsonString);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(countUnreadNotifications:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  long count = [self _countUnreadNotifications];
  NSNumber *num = [NSNumber numberWithLong:count];
  resolve(num);
}

RCT_EXPORT_METHOD(readNotification:(NSString *)id resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _readNotification:id error:&error];
  if (!error) {
    resolve(nil);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(readAllNotifications:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self _readAllNotifications:&error];
  if (!error) {
    resolve(nil);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(acceptThreadInviteViaNotification:(NSString *)id resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *threadId = [self _acceptThreadInviteViaNotification:id error:&error];
  if (!error) {
    resolve(threadId);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

RCT_EXPORT_METHOD(getContacts:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *jsonString = [self _getContacts:&error];
  if (!error) {
    resolve(jsonString);
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

- (NSString *)_getTokens:(BOOL *)force error:(NSError**)error {
  return [self.node getTokens:force error:error];
}

- (NSString *)_getId:(NSError**)error {
  return [self.node getId:error];
}

- (NSString *)_getOverview:(NSError**)error {
  return [self.node overview:error];
}

- (NSString *)_getPubKey:(NSError**)error {
  return [self.node getPubKey:error];
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

- (NSString *)_addThread:(NSString *)name error:(NSError**)error {
  return [self.node addThread:name error:error];
}

- (NSString *)_threads:(NSError**)error {
  return [self.node threads:error];
}

- (NSString *)_addThreadInvite:(NSString *)threadId inviteePk:(NSString *)inviteePk error:(NSError**)error {
  return [self.node addThreadInvite:threadId inviteePk:inviteePk error:error];
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

- (NSString *)_getPhotoData:(NSString *)photoId path:(NSString *)path error:(NSError**)error {
  return [self.node getPhotoData:photoId path:path error:error];
}

- (NSString *)_getPhotoDataForMinWidth:(NSString *)photoId minWidth:(int)minWidth error:(NSError**)error {
  return [self.node getPhotoDataForMinWidth:photoId minWidth:minWidth error:error];
}

- (NSString *)_getPhotoThreads:(NSString *)photoId error:(NSError**)error {
  return [self.node photoThreads:photoId error:error];
}

- (NSString *)_getPhotoKey:(NSString *)photoId error:(NSError**)error {
  return [self.node getPhotoKey:photoId error:error];
}

- (NSString *)_ignorePhoto:(NSString *)blockId error:(NSError**)error {
  return [self.node ignorePhoto:blockId error:error];
}

- (NSString *)_addPhotoComment:(NSString *)blockId body:(NSString *)body error:(NSError**)error {
  return [self.node addPhotoComment:blockId body:body error:error];
}

- (NSString *)_ignorePhotoComment:(NSString *)blockId error:(NSError**)error {
  return [self.node ignorePhotoComment:blockId error:error];
}

- (NSString *)_addPhotoLike:(NSString *)blockId error:(NSError**)error {
  return [self.node addPhotoLike:blockId error:error];
}

- (NSString *)_ignorePhotoLike:(NSString *)blockId error:(NSError**)error {
  return [self.node ignorePhotoLike:blockId error:error];
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

- (NSString *)_getNotifications:(NSString *)offset limit:(long)limit error:(NSError**)error {
  return [self.node getNotifications:offset limit:limit error:error];
}

- (long)_countUnreadNotifications {
  return [self.node countUnreadNotifications];
}

- (void)_readNotification:(NSString *)id error:(NSError**)error {
  [self.node readNotification:id error:error];
}

- (void)_readAllNotifications:(NSError**)error {
  [self.node readAllNotifications:error];
}

- (NSString *)_acceptThreadInviteViaNotification:(NSString *)id error:(NSError**)error {
  return [self.node acceptThreadInviteViaNotification:id error:error];
}

- (NSString *)_getContacts:(NSError**)error {
  return [self.node contacts:error];
}

- (void)_refreshMessages:(NSError**)error {
  [self.node refreshMessages:error];
}

- (void)_processJPG:(PHAsset *)asset orgFilename:(NSString *)orgFilename  {
  // If the file isn't a HEIC, just write it to temp and move along.
  [[PHImageManager defaultManager] requestImageDataForAsset:asset options:nil resultHandler:^(NSData * _Nullable imageData, NSString * _Nullable dataUTI, UIImageOrientation imageOrientation, NSDictionary * _Nullable info) {
    // Got the image data for copying
    if (imageData) {
      // Get our path in the tmp directory
      NSString *path = [[NSTemporaryDirectory()stringByStandardizingPath] stringByAppendingPathComponent:orgFilename];

      // Write the data to the temp file
      BOOL success = [imageData writeToFile:path atomically:YES];
      if (success) {
        [self _processImage:asset imageOrientation:imageOrientation path:path ];
      }
    }
  }];
}

- (void)_processHEIC:(PHAsset *)asset orgFilename:(NSString *)orgFilename {
  // If the file is HEIC, first we need to get the real UIImage, then conver to JPG
  PHImageRequestOptions *requestOptions = [[PHImageRequestOptions alloc] init];
  requestOptions.resizeMode   = PHImageRequestOptionsResizeModeExact;
  requestOptions.deliveryMode = PHImageRequestOptionsDeliveryModeHighQualityFormat;
  // Optional way later to get rid of the Event based returns with RN
  // requestOptions.synchronous = @TRUE;
  // Make the request for the UIImage
  [[PHImageManager defaultManager] requestImageForAsset:asset
                                             targetSize:PHImageManagerMaximumSize
                                            contentMode:PHImageContentModeDefault
                                                options:requestOptions
                                          resultHandler:^void(UIImage *image, NSDictionary *info) {
                                            // Force the HEIC to JPEG, no loss
                                            NSData *jpegData = UIImageJPEGRepresentation(image, 1.0);
                                            NSString *jpgFilename = [NSString stringWithFormat:@"%@.%@", [orgFilename stringByDeletingPathExtension], @"jpg"];

                                            // Get our path in the tmp directory
                                            NSString *path = [[NSTemporaryDirectory()stringByStandardizingPath] stringByAppendingPathComponent:jpgFilename];

                                            // Write the data to the temp file
                                            BOOL success = [jpegData writeToFile:path atomically:YES];
                                            if (success) {
                                              [self _processImage:asset imageOrientation:1 path:path ];
                                            }
                                          }];
}

- (void)_processImage:(PHAsset *)asset imageOrientation:(NSInteger)imageOrientation path:(NSString *)path {
  // Setup date-string conversion
  NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
  // Ensure date string is always in UTC
  [dateFormatter setTimeZone:[NSTimeZone timeZoneWithAbbreviation:@"UTC"]];
  [dateFormatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"];

  // creationDate is also available, but seems to be pure exif date
  NSDate *newDate = asset.modificationDate;
  NSDate *creationDate = asset.creationDate;
  // dataWithJSONObject cannot include NSDate
  NSString *dateString = [dateFormatter stringFromDate:newDate];
  NSString *creationDateString = [dateFormatter stringFromDate:creationDate];
  // get an int
  NSNumber *orientation = imageOrientation ? [NSNumber numberWithInt:imageOrientation] : [NSNumber numberWithInt:1];

  NSDictionary *payload = @{ @"uri": path, @"path": path, @"modificationDate": dateString, @"creationDate": creationDateString, @"assetId": asset.localIdentifier, @"orientation": orientation, @"canDelete": @true};
  NSError *serializationError;
  NSData *data = [NSJSONSerialization dataWithJSONObject:payload options:NSJSONWritingPrettyPrinted error:&serializationError];
  if(!serializationError) {
    NSString* jsonStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    // Send our event back to RN
    [Events emitEventWithName:@"newLocalPhoto" andPayload:jsonStr];
  }
}

@end

@implementation RCTBridge (TextileNode)

- (TextileNode *)textileNode
{
  return [self moduleForClass:[TextileNode class]];
}

@end
