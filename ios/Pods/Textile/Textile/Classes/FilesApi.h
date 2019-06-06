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
 * Prepare raw data to later add to a Textile thread
 * @param data Raw base64 string data
 * @param threadId The thread id the data will be added to
 * @param completion A block that will get called with the results of the prepare operation
 */
- (void)prepare:(NSString *)data threadId:(NSString *)threadId completion:(void (^)(MobilePreparedFiles * _Nullable, NSError *))completion;

/**
 * Prepare file data to later add to a Textile thread
 * @param path The path to the file containing the data to prepare
 * @param threadId The thread id the data will be added to
 * @param completion A block that will get called with the results of the prepare operation
 */
- (void)prepareByPath:(NSString *)path threadId:(NSString *)threadId completion:(void (^)(MobilePreparedFiles * _Nullable, NSError *))completion;

/**
 * Prepare raw data synchronously to later add to a Textile thread
 * @param data Raw base64 string data
 * @param threadId The thread id the data will be added to
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return An object containing data about the prepared files that will be used to add to the thread later
 */
- (MobilePreparedFiles *)prepareSync :(NSString *)data threadId:(NSString *)threadId error:(NSError **)error;

/**
 * Prepare file data synchronously to later add to a Textile thread
 * @param path The path to the file containing the data to prepare
 * @param threadId The thread id the data will be added to
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return An object containing data about the prepared files that will be used to add to the thread later
 */
- (MobilePreparedFiles *)prepareByPathSync:(NSString *)path threadId:(NSString *)threadId error:(NSError **)error;

/**
 * Add data to a Textile thread
 * @param directory The Directory data that was previously prepared
 * @param threadId The thread to add the data to
 * @param caption A caption to associate with the data
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The Block representing the added data
 */
- (Block *)add:(Directory *)directory threadId:(NSString *)threadId caption:(nullable NSString *)caption error:(NSError **)error;

/**
 * Add data from a Textile thread to another Textile thread
 * @param target The target from the source thread of the data to add
 * @param threadId The thread to add the data to
 * @param caption A caption to associate with the data
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The Block representing the added data
 */
- (Block *)addByTarget:(NSString *)target threadId:(NSString *)threadId caption:(nullable NSString *)caption error:(NSError **)error;

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
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The base64 string of data
 */
- (NSString *)data:(NSString *)hash error:(NSError **)error;

/**
 * Helper function to return the most appropriate image data for a minimun image width
 * @param path The IPFS path that includes image data for various image sizes
 * @param minWidth The width of the image the data will be used for
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The base64 string of image data
 */
- (NSString *)imageDataForMinWidth:(NSString *)path minWidth:(long)minWidth error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
