//
//  FilesApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/Mobile.pbobjc.h>
#import <TextileCore/Model.pbobjc.h>
#import <TextileCore/View.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Provides access to Textile files related APIs
 */
@interface FilesApi : NodeDependant

/**
 * Add raw data to a Textile thread
 * @param data Raw data
 * @param threadId The thread id the data will be added to
 * @param caption A caption to associate with the data
 * @param completion A block that will get called with the results of the add operation
 */
- (void)addData:(NSData *)data threadId:(NSString *)threadId caption:(NSString *)caption completion:(void (^)(Block * _Nullable, NSError * _Nonnull))completion;

/**
 * Add files to a Textile thread
 * @param files A comma-separated list of file paths to add, paths can be file system paths, IPFS hashes, or an existing file hash that may need decryption
 * @param threadId The thread id the files will be added to
 * @param caption A caption to associate with the files
 * @param completion A block that will get called with the results of the add operation
 */
- (void)addFiles:(NSString *)files threadId:(NSString *)threadId caption:(NSString *)caption completion:(void (^)(Block * _Nullable, NSError * _Nonnull))completion;

/**
 * Share files already aded to a Textile thread to a Textile thread
 * @param target The source thread target of the files to share
 * @param threadId The thread id the files will be shared to
 * @param caption A caption to associate with the files
 * @param completion A block that will get called with the results of the add operation
 */
- (void)shareFiles:(NSString *)target threadId:(NSString *)threadId caption:(NSString *)caption completion:(void (^)(Block * _Nullable, NSError * _Nonnull))completion;

/**
 * Get a list of files data from a thread
 * @param threadId The thread to query
 * @param offset The offset to beging querying from
 * @param limit The max number of results to return
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return An object containing a list of files data
 */
- (FilesList *)list:(NSString *)threadId offset:(nullable NSString *)offset limit:(long)limit error:(NSError **)error;

/**
 * Get raw data for a file hash
 * @param hash The hash to return data for
 * @param completion A block that will get called with the results of content
 */
- (void)content:(NSString *)hash completion:(void (^)(NSData * _Nullable, NSString * _Nullable, NSError * _Nonnull))completion;

/**
 * Helper function to return the most appropriate image data for a minimun image width
 * @param path The IPFS path that includes image data for various image sizes
 * @param minWidth The width of the image the data will be used for
 * @param completion A block that will get called with the results of content
 */
- (void)imageContentForMinWidth:(NSString *)path minWidth:(long)minWidth completion:(void (^)(NSData * _Nullable, NSString * _Nullable, NSError * _Nonnull))completion;

@end

NS_ASSUME_NONNULL_END
