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

- (ContactList *)peers:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node accountPeers:error];
  return [[ContactList alloc] initWithData:data error:error];
}

- (MobileSearchHandle *)findThreadBackups:(ThreadBackupQuery *)query options:(QueryOptions *)options error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node findThreadBackups:query.data options:options.data error:error];
}

@end
