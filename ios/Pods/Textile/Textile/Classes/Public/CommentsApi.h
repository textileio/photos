//
//  CommentsApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Provides access to Textile comments related APIs
 */
@interface CommentsApi : NodeDependant

/**
 * Add a comment to any block by id
 * @param blockId The id of the block you want to add a comment to
 * @param body The text of the comment to add
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The id of the new comment block
 */
- (NSString *)add:(NSString *)blockId body:(NSString *)body error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
