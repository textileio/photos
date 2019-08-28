//
//  Cafe.m
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "CafesApi.h"
#import "Callback.h"
#import "ProtoCallback.h"

@implementation CafesApi

- (void)register:(NSString *)peerId token:(NSString *)token completion:(void (^)(NSError * _Nonnull))completion {
  Callback *cb = [[Callback alloc] initWithCompletion:^(NSError *error) {
    completion(error);
  }];
  [self.node registerCafe:peerId token:token cb:cb];
}

- (void)deregister:(NSString *)peerId completion:(void (^)(NSError * _Nonnull))completion {
  Callback *cb = [[Callback alloc] initWithCompletion:^(NSError *error) {
    completion(error);
  }];
  [self.node deregisterCafe:peerId cb:cb];
}

- (void)refreshSession:(NSString *)peerId completion:(void (^)(CafeSession * _Nullable, NSError * _Nonnull))completion {
  ProtoCallback *cb = [[ProtoCallback alloc] initWithCompletion:^(NSData *data, NSError *error) {
    if (error) {
      completion(nil, error);
    } else {
      NSError *error;
      CafeSession *session = [[CafeSession alloc] initWithData:data error:&error];
      completion(session, error);
    }
  }];
  [self.node refreshCafeSession:peerId cb:cb];
}

- (void)checkMessages:(void (^)(NSError * _Nonnull))completion {
  Callback *cb = [[Callback alloc] initWithCompletion:^(NSError *error) {
    completion(error);
  }];
  [self.node checkCafeMessages:cb];
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

@end
