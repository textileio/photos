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
  if (*error) {
    return nil;
  }
  return [[Thread alloc] initWithData:data error:error];
}

- (void)addOrUpdate:(Thread *)thrd error:(NSError * _Nullable __autoreleasing *)error {
  [self.node addOrUpdateThread:thrd.data error:error];
}

- (void)rename:(NSString *)threadId name:(NSString *)name error:(NSError * _Nullable __autoreleasing *)error {
  [self.node renameThread:threadId name:name error:error];
}

- (Thread *)get:(NSString *)threadId error:(NSError * _Nullable __autoreleasing *)error {
  /*
   * thread returns an error if no thread is found.
   */
  NSData *data = [self.node thread:threadId error:error];
  if (*error) {
    return nil;
  }
  return [[Thread alloc] initWithData:data error:error];
}

- (ThreadList *)list:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node threads:error];
  if (*error) {
    return nil;
  }
  return [[ThreadList alloc] initWithData:data error:error];
}

- (ContactList *)peers:(NSString *)threadId error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node threadPeers:threadId error:error];
  if (*error) {
    return nil;
  }
  return [[ContactList alloc] initWithData:data error:error];
}

- (NSString *)remove:(NSString *)threadId error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node removeThread:threadId error:error];
}

- (void)snapshot:(NSError * _Nullable __autoreleasing *)error {
  [self.node snapshotThreads:error];
}

- (MobileSearchHandle *)searchSnapshots:(ThreadSnapshotQuery *)query options:(QueryOptions *)options error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node searchThreadSnapshots:query.data options:options.data error:error];
}

@end
