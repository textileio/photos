//
//  Cafe.h
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/Model.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Provides access to Textile cafes related APIs
 */
@interface CafesApi : NodeDependant

/**
 * Used to register a remote Textile Cafe node with the local Textile node
 * @param peerId The peer id of the cafe being registered
 * @param token The API token for the cafe being registered
 * @param completion A block that will get called with an error
 */
- (void)register:(NSString *)peerId token:(NSString *)token completion:(void (^)(NSError * _Nonnull))completion;

/**
 * Used to deregister a previously registered Textile Cafe
 * @param peerId The peer id of the cafe you want to deregister
 * @param completion A block that will get called with an error
 */
- (void)deregister:(NSString *)peerId completion:(void (^)(NSError * _Nonnull))completion;

/**
 * Used to refresh an individual Textile Cafe session
 * @param peerId The peer id of the cafe who's session you want to refresh
 * @param completion A block that will get called with the results of the refresh operation
 */
- (void)refreshSession:(NSString *)peerId completion:(void (^)(CafeSession * _Nullable, NSError * _Nonnull))completion;

/**
 * Triggers the async process of checking for messages from all registered cafes
 * @param error A reference to an error pointer that will be set in the case of an error
 */
- (void)checkMessages:(NSError **)error;

/**
 * Fetches the CafeSession object for a previously registered Textile Cafe node
 * @param peerId The peer id of the previously registered cafe node
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The CafeSession for the previously registered cafe
 */
- (CafeSession *)session:(NSString *)peerId error:(NSError **)error;

/**
 * Used to get sessions for all previously registered Textile Cafes
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return An object containing a list of cafe sessions
 */
- (CafeSessionList *)sessions:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
