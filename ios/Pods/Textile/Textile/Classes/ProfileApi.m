//
//  ProfileApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "ProfileApi.h"

@implementation ProfileApi

- (Contact *)get:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node profile:error];
  return [[Contact alloc] initWithData:data error:error];
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

- (void)setAvatar:(NSString *)hash error:(NSError * _Nullable __autoreleasing *)error {
  [self.node setAvatar:hash error:error];
}

@end
