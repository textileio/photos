//
//  LikesApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Provides access to Textile likes related APIs
 */
@interface LikesApi : NodeDependant

/**
 * Add a like for a specific block
 * @param blockId The id of the block you want to add a like to
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The hash of the newly created like block
 */
- (NSString *)add:(NSString *)blockId error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
