//
//  ProfileApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "ProfileApi.h"
#import "TextileApi.h"

@implementation ProfileApi

- (Peer *)get:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node profile:error];
  if (*error) {
    return nil;
  }
  return [[Peer alloc] initWithData:data error:error];
}

- (NSString *)name:(NSError * _Nullable __autoreleasing *)error {
  return [self.node name:error];
}

- (void)setName:(NSString *)name error:(NSError * _Nullable __autoreleasing *)error {
  [self.node setName:name error:error];
}

- (NSString *)avatar:(NSError * _Nullable __autoreleasing *)error {
  return [self.node avatar:error];
}

- (Thread *)accountThread:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node accountThread:error];
  if (*error) {
    return nil;
  }
  return [[Thread alloc] initWithData:data error:error];
}

@end
