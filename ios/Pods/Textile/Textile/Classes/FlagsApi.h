//
//  Flags.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

@interface FlagsApi : NodeDependant

- (NSString *)add:(NSString *)blockId error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
