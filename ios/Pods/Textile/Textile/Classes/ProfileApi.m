//
//  ProfileApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "ProfileApi.h"
#import "ProtoCallback.h"

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

- (void)setAvatar:(NSString *)item completion:(void (^)(Block * _Nullable, NSError * _Nonnull))completion {
  ProtoCallback *cb = [[ProtoCallback alloc] initWithCompletion:^(NSData *data, NSError *error) {
    if (error) {
      completion(nil, error);
    } else {
      NSError *error;
      Block *block = [[Block alloc] initWithData:data error:&error];
      completion(block, error);
    }
  }];
  [self.node setAvatar:item cb:cb];
}

- (Thread *)accountThread:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node accountThread:error];
  if (*error) {
    return nil;
  }
  return [[Thread alloc] initWithData:data error:error];
}

@end
