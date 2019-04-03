//
//  CommentsApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

@interface CommentsApi : NodeDependant

- (NSString *)add:(NSString *)blockId body:(NSString *)body error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
