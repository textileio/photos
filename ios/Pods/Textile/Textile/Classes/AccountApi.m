//
//  Account.m
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "AccountApi.h"

@implementation AccountApi

- (NSString *)address {
  return self.node.address;
}

- (NSString *)seed {
  return self.node.seed;
}

- (NSData *)encrypt:(NSData *)data error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node encrypt:data error:error];
}

- (NSData *)decrypt:(NSData *)data error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node decrypt:data error:error];
}

- (Contact *)contact:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node accountContact:error];
  return [[Contact alloc] initWithData:data error:error];
}

- (MobileSearchHandle *)sync:(QueryOptions *)options error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node syncAccount:options.data error:error];
}

@end
