//
//  Cafe.m
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "CafesApi.h"

@implementation CafesApi

- (void)register:(NSString *)peerId token:(NSString *)token error:(NSError * _Nullable __autoreleasing *)error {
  [self.node registerCafe:peerId token:token error:error];
}

- (CafeSession *)session:(NSString *)peerId error:(NSError * _Nullable __autoreleasing *)error {
  /*
   * cafeSession returns nil and no error if no session is found.
   * If we get no data back or there was an error, return nil.
   */
  NSData *data = [self.node cafeSession:peerId error:error];
  if (!data || *error) {
    return nil;
  }
  return [[CafeSession alloc] initWithData:data error:error];
}

- (CafeSessionList *)sessions:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node cafeSessions:error];
  if (*error) {
    return nil;
  }
  return [[CafeSessionList alloc] initWithData:data error:error];
}

- (CafeSession *)refreshSession:(NSString *)peerId error:(NSError * _Nullable __autoreleasing *)error {
  /*
   * refreshCafeSession returns nil and no error if no session is found.
   * If we get no data back or there was an error, return nil.
   */
  NSData *data = [self.node refreshCafeSession:peerId error:error];
  if (!data || *error) {
    return nil;
  }
  return [[CafeSession alloc] initWithData:data error:error];
}

- (void)deregister:(NSString *)peerId error:(NSError * _Nullable __autoreleasing *)error {
  [self.node deregisterCafe:peerId error:error];
}

- (void)checkMessages:(NSError * _Nullable __autoreleasing *)error {
  [self.node checkCafeMessages:error];
}

@end
