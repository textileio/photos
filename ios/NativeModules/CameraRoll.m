#import "CameraRoll.h"
#import "Events.h"
#import <Photos/Photos.h>

// import RCTBridge
#if __has_include(<React/RCTBridge.h>)
#import <React/RCTBridge.h>
#elif __has_include(“RCTBridge.h”)
#import “RCTBridge.h”
#else
#import “React/RCTBridge.h” // Required when used as a Pod in a Swift project
#endif

@implementation CameraRoll

RCT_EXPORT_MODULE();

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

@implementation RCTBridge (CameraRoll)

- (CameraRoll *)cameraRoll {
  return [self moduleForClass:[CameraRoll class]];
}

@end
