//
//  Ignores.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "IgnoresApi.h"

@implementation IgnoresApi

- (NSString *)add:(NSString *)blockId error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node addIgnore:blockId error:error];
}

@end
