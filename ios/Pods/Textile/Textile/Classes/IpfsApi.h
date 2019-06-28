//
//  IpfsApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Provides access to Textile IPFS related APIs
 */
@interface IpfsApi : NodeDependant

/**
 * Fetch the IPFS peer id
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The IPFS peer id of the local Textile node
 */
- (NSString *)peerId:(NSError **)error;

/**
 * Get raw data stored at an IPFS path
 * @param path The IPFS path for the data you want to retrieve
 * @param completion A block that will get called with the results of the query
 */
- (void)dataAtPath:(NSString *)path completion:(void (^)(NSData * _Nullable, NSString * _Nullable, NSError * _Nonnull))completion;

@end

NS_ASSUME_NONNULL_END
