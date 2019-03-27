//
//  Cafe.m
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "CafesApi.h"

@implementation CafesApi

- (void)register:(NSString *)host token:(NSString *)token error:(NSError * _Nullable __autoreleasing *)error {
  [self.node registerCafe:host token:token error:error];
}

- (CafeSession *)session:(NSString *)peerId error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node cafeSession:peerId error:error];
  return [[CafeSession alloc] initWithData:data error:error];
}

- (CafeSessionList *)sessions:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node cafeSessions:error];
  return [[CafeSessionList alloc] initWithData:data error:error];
}

- (CafeSession *)refreshSession:(NSString *)peerId error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node refreshCafeSession:peerId error:error];
  return [[CafeSession alloc] initWithData:data error:error];
}

- (void)deregister:(NSString *)peerId error:(NSError * _Nullable __autoreleasing *)error {
  [self.node deregisterCafe:peerId error:error];
}

- (void)checkMessages:(NSError * _Nullable __autoreleasing *)error {
  [self.node checkCafeMessages:error];
}

@end
