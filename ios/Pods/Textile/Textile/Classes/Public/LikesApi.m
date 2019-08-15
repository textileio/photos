//
//  LikesApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "LikesApi.h"

@implementation LikesApi

- (NSString *)add:(NSString *)blockId error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node addLike:blockId error:error];
}

@end
