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

- (Block *)setAvatar:(Directory *)directory error:(NSError * _Nullable __autoreleasing *)error {
  Thread *accountThread = [self accountThread:error];
  if (*error) {
    return nil;
  }
  return [Textile.instance.files add:directory threadId:accountThread.id_p caption:nil error:error];
}

- (Block *)setAvatarByTarget:(NSString *)hash error:(NSError * _Nullable __autoreleasing *)error {
  Thread *accountThread = [self accountThread:error];
  if (*error) {
    return nil;
  }
  return [Textile.instance.files addByTarget:hash threadId:accountThread.id_p caption:nil error:error];
}

- (Thread *)accountThread:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node accountThread:error];
  if (*error) {
    return nil;
  }
  return [[Thread alloc] initWithData:data error:error];
}

@end
