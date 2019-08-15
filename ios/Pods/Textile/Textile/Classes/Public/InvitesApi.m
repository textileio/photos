//
//  InvitesApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "InvitesApi.h"

@implementation InvitesApi

- (void)add:(NSString *)threadId address:(NSString *)address error:(NSError * _Nullable __autoreleasing *)error {
  [self.node addInvite:threadId address:address error:error];
}

- (ExternalInvite *)addExternal:(NSString *)threadId error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node addExternalInvite:threadId error:error];
  if (*error) {
    return nil;
  }
  return [[ExternalInvite alloc] initWithData:data error:error];
}

- (InviteViewList *)list:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node invites:error];
  if (*error) {
    return nil;
  }
  return [[InviteViewList alloc] initWithData:data error:error];
}

- (NSString *)accept:(NSString *)inviteId error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node acceptInvite:inviteId error:error];
}

- (NSString *)acceptExternal:(NSString *)inviteId key:(NSString *)key error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node acceptExternalInvite:inviteId key:key error:error];
}

- (void)ignore:(NSString *)inviteId error:(NSError * _Nullable __autoreleasing *)error {
  [self.node ignoreInvite:inviteId error:error];
}

@end
