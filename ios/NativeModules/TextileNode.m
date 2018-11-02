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

// Export methods to a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html

RCT_EXPORT_METHOD(acceptExternalThreadInvite:(NSString*)id_ key:(NSString*)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node acceptExternalThreadInvite:id_ key:key error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(acceptThreadInviteViaNotification:(NSString*)id_ resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node acceptThreadInviteViaNotification:id_ error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(addExternalThreadInvite:(NSString*)threadId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node addExternalThreadInvite:threadId error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(addPhoto:(NSString*)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node addPhoto:path error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(addPhotoComment:(NSString*)blockId body:(NSString*)body resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node addPhotoComment:blockId body:body error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(addPhotoLike:(NSString*)blockId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node addPhotoLike:blockId error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(addPhotoToThread:(NSString*)dataId key:(NSString*)key threadId:(NSString*)threadId caption:(NSString*)caption resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node addPhotoToThread:dataId key:key threadId:threadId caption:caption error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(addThread:(NSString*)name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node addThread:name error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(addThreadInvite:(NSString*)threadId inviteeId:(NSString*)inviteeId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node addThreadInvite:threadId inviteeId:inviteeId error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(address:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node address:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(cafeSession:(NSString*)peerId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node cafeSession:peerId error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(cafeSessions:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node cafeSessions:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(checkCafeMail:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self.node checkCafeMail:&error];
  [self fulfillWithResult:nil error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(contact:(NSString*)id_ resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node contact:id_ error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(contactThreads:(NSString*)id_ resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node contactThreads:id_ error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(contactUsername:(NSString*)id_ resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node contactUsername:id_];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(contacts:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node contacts:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(countUnreadNotifications:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  long result = [self.node countUnreadNotifications];
  [self fulfillWithResult:[NSNumber numberWithLong:result] error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(deregisterCafe:(NSString*)peerId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self.node deregisterCafe:peerId error:&error];
  [self fulfillWithResult:nil error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(ignorePhoto:(NSString*)blockId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node ignorePhoto:blockId error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(ignorePhotoComment:(NSString*)blockId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node ignorePhotoComment:blockId error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(ignorePhotoLike:(NSString*)blockId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node ignorePhotoLike:blockId error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(notifications:(NSString*)offset limit:(long)limit resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node notifications:offset limit:limit error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(overview:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node overview:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(peerId:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node peerId:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(peerProfile:(NSString*)peerId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node peerProfile:peerId error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(photoData:(NSString*)id_ path:(NSString*)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _photoData:id_ path:path error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(photoDataForMinWidth:(NSString*)id_ minWidth:(long)minWidth resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self _photoDataForMinWidth:id_ minWidth:minWidth error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(photoKey:(NSString*)id_ resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node photoKey:id_ error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(photoMetadata:(NSString*)id_ resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node photoMetadata:id_ error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(photoThreads:(NSString*)id_ resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node photoThreads:id_ error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(photos:(NSString*)offset limit:(long)limit threadId:(NSString*)threadId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node photos:offset limit:limit threadId:threadId error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(profile:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node profile:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(readAllNotifications:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self.node readAllNotifications:&error];
  [self fulfillWithResult:nil error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(readNotification:(NSString*)id_ resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self.node readNotification:id_ error:&error];
  [self fulfillWithResult:nil error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(refreshCafeSession:(NSString*)cafeId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node refreshCafeSession:cafeId error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(registerCafe:(NSString*)peerId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self.node registerCafe:peerId error:&error];
  [self fulfillWithResult:nil error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(removeThread:(NSString*)id_ resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node removeThread:id_ error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(seed:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node seed:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(setAvatar:(NSString*)id_ resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self.node setAvatar:id_ error:&error];
  [self fulfillWithResult:nil error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(setUsername:(NSString*)username resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self.node setUsername:username error:&error];
  [self fulfillWithResult:nil error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(sharePhotoToThread:(NSString*)dataId threadId:(NSString*)threadId caption:(NSString*)caption resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node sharePhotoToThread:dataId threadId:threadId caption:caption error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(start:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self.node start:&error];
  [self fulfillWithResult:nil error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(stop:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  [self.node stop:&error];
  [self fulfillWithResult:nil error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(threadInfo:(NSString*)threadId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node threadInfo:threadId error:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(threads:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node threads:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(username:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = [self.node username:&error];
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(version:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSString *result = [self.node version];
  [self fulfillWithResult:result error:nil resolver:resolve rejecter:reject];
}

// Order of things to init and create the repo:
// MobileNewTextile If error, inspect it and run next steps or migration
// MobileNewWallet returns mnemonic
// MobileWalletAccountAt returns seed and address
// MobileInitRepo only run one time ever
// MobileNewTextile

RCT_EXPORT_METHOD(initRepo:(NSString*)seed repoPath:(NSString*)repoPath logLevel:(NSString*)logLevel logToDisk:(BOOL)logToDisk resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  MobileInitConfig *config = [[MobileInitConfig alloc] init];
  config.seed = seed;
  config.repoPath = repoPath;
  config.logLevel = logLevel;
  config.logToDisk = logToDisk;
  NSError *error;
  MobileInitRepo(config, &error); // only run one time ever
  [self fulfillWithResult:nil error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(migrateRepo:(NSString*)repoPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  MobileMigrateConfig *config = [[MobileMigrateConfig alloc] init];
  config.repoPath = repoPath;
  NSError *error;
  MobileMigrateRepo(config, &error);
  [self fulfillWithResult:nil error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(newTextile:(NSString*)repoPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  if (!self.node) {
    MobileRunConfig *config = [[MobileRunConfig alloc] init];
    config.repoPath = repoPath;
    self.node = MobileNewTextile(config, [[Messenger alloc] init], &error); // Returns the 'needs migration error'
  }
  [self fulfillWithResult:nil error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(newWallet:(long)wordCount resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = MobileNewWallet(wordCount, &error); // returns mnemonic
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(walletAccountAt:(NSString*)phrase index:(long)index password:(NSString*)password resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *result = MobileWalletAccountAt(phrase, index, password, &error); // return seed and address
  [self fulfillWithResult:result error:error resolver:resolve rejecter:reject];
}

- (void)fulfillWithResult:(id)result error:(NSError*)error resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject {
  if (!error) {
    resolve(result);
  } else {
    reject(@(error.code).stringValue, error.localizedDescription, error);
  }
}

// Couple methods that need to be available from RN and within Obj C

- (NSString*)_photoData:(NSString*)id_ path:(NSString*)path error:(NSError**)error {
  NSString *result = [self.node photoData:id_ path:path error:error];
  return result;
}

- (NSString*)_photoDataForMinWidth:(NSString*)id_ minWidth:(long)minWidth error:(NSError**)error {
  NSString *result = [self.node photoDataForMinWidth:id_ minWidth:minWidth error:error];
  return result;
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
  NSNumber *orientation = imageOrientation ? [NSNumber numberWithInteger:imageOrientation] : [NSNumber numberWithInt:1];

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
