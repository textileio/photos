//
//  InvitesApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "InvitesApi.h"

@implementation InvitesApi

- (NSString *)add:(NSString *)threadId inviteeId:(NSString *)inviteeId error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node addInvite:threadId inviteeId:inviteeId error:error];
}

- (NewInvite *)addExternal:(NSString *)threadId error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node addExternalInvite:threadId error:error];
  return [[NewInvite alloc] initWithData:data error:error];
}

- (NSString *)acceptExternal:(NSString *)inviteId key:(NSString *)key error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node acceptExternalInvite:inviteId key:key error:error];
}

@end
