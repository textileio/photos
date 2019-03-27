//
//  SchemasApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/8/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "SchemasApi.h"

@implementation SchemasApi

- (FileIndex *)add:(Node *)schemaNode error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node addSchema:schemaNode.data error:error];
  return [[FileIndex alloc] initWithData:data error:error];
}

@end
