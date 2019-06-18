//
//  ThreadsApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/Model.pbobjc.h>
#import <TextileCore/View.pbobjc.h>
#import <TextileCore/Query.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Provides access to Textile threads related APIs
 */
@interface ThreadsApi : NodeDependant

/**
 * Create a new thread
 * @param config The configuration object that describes the thread to be created
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The newly created thread
 */
- (Thread *)add:(AddThreadConfig *)config error:(NSError **)error;

/**
 * Update an existing thread or create it if it doesn't exist
 * @param thrd The updated representation of the thread to update
 * @param error A reference to an error pointer that will be set in the case of an error
 */
- (void)addOrUpdate:(Thread *)thrd error:(NSError **)error;

/**
 * Rename a thread
 * @param threadId The id of the thread to rename
 * @param name The new name for the thread
 * @param error A reference to an error pointer that will be set in the case of an error
 */
- (void)rename:(NSString *)threadId name:(NSString *)name error:(NSError **)error;

/**
 * Get an existing thread by id
 * @param threadId The id of the thread to retrieve
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The corresponding thread object
 */
- (Thread *)get:(NSString *)threadId error:(NSError **)error;

/**
 * List all threads the local peer account participates in
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return An object containing a list of threads
 */
- (ThreadList *)list:(NSError **)error;

/**
 * List all contacts that participate in a particular thread
 * @param threadId The id of the thread to query
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return An object containing a list of contacts
 */
- (PeerList *)peers:(NSString *)threadId error:(NSError **)error;

/**
 * Leave a thread
 * @param threadId The id of the thread to remove
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The hash of the newly created thread leave block
 */
- (NSString *)remove:(NSString *)threadId error:(NSError **)error;

/**
 * Snapshot all threads and sync them to registered cafes
 * @param error A reference to an error pointer that will be set in the case of an error
 */
- (void)snapshot:(NSError **)error;

/**
 * Searches the network for thread snapshots
 * @param query The object describing the query to execute
 * @param options Options controlling the behavior of the search
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return A handle that can be used to cancel the search
 */
- (MobileSearchHandle *)searchSnapshots:(ThreadSnapshotQuery *)query options:(QueryOptions *)options error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
