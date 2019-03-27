//
//  ThreadsApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "ThreadsApi.h"

@implementation ThreadsApi

- (Thread *)add:(AddThreadConfig *)config error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node addThread:config.data error:error];
  return [[Thread alloc] initWithData:data error:error];
}

- (void)addOrUpdate:(Thread *)thrd error:(NSError * _Nullable __autoreleasing *)error {
  [self.node addOrUpdateThread:thrd.data error:error];
}

- (void)rename:(NSString *)threadId name:(NSString *)name error:(NSError * _Nullable __autoreleasing *)error {
  [self.node renameThread:threadId name:name error:error];
}

- (Thread *)get:(NSString *)threadId error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node thread:threadId error:error];
  return [[Thread alloc] initWithData:data error:error];
}

- (ThreadList *)list:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node threads:error];
  return [[ThreadList alloc] initWithData:data error:error];
}

- (ContactList *)peers:(NSString *)threadId error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node threadPeers:threadId error:error];
  return [[ContactList alloc] initWithData:data error:error];
}

- (NSString *)remove:(NSString *)threadId error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node removeThread:threadId error:error];
}

@end
