//
//  FilesApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "FilesApi.h"
#import "Callback.h"

@implementation FilesApi

- (void)prepare:(NSString *)data threadId:(NSString *)threadId completion:(void (^)(MobilePreparedFiles * _Nullable, NSError * _Nonnull))completion {
  Callback *cb = [[Callback alloc] initWithCompletion:^(NSData *data, NSError *error) {
    if (error) {
      completion(nil, error);
    } else {
      NSError *error;
      MobilePreparedFiles *files = [[MobilePreparedFiles alloc] initWithData:data error:&error];
      completion(files, error);
    }
  }];
  [self.node prepareFiles:data threadId:threadId cb:cb];
}

- (void)prepareByPath:(NSString *)path threadId:(NSString *)threadId completion:(void (^)(MobilePreparedFiles * _Nullable, NSError * _Nonnull))completion {
  Callback *cb = [[Callback alloc] initWithCompletion:^(NSData *data, NSError *error) {
    if (error) {
      completion(nil, error);
    } else {
      NSError *error;
      MobilePreparedFiles *files = [[MobilePreparedFiles alloc] initWithData:data error:&error];
      completion(files, error);
    }
  }];
  [self.node prepareFilesByPath:path threadId:threadId cb:cb];
}

- (MobilePreparedFiles *)prepareSync:(NSString *)data threadId:(NSString *)threadId error:(NSError * _Nullable __autoreleasing *)error {
  NSData *result = [self.node prepareFilesSync:data threadId:threadId error:error];
  if (*error) {
    return nil;
  }
  return [[MobilePreparedFiles alloc] initWithData:result error:error];
}

- (MobilePreparedFiles *)prepareByPathSync:(NSString *)path threadId:(NSString *)threadId error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node prepareFilesByPathSync:path threadId:threadId error:error];
  if (*error) {
    return nil;
  }
  return [[MobilePreparedFiles alloc] initWithData:data error:error];
}

- (Block *)add:(Directory *)directory threadId:(NSString *)threadId caption:(NSString *)caption error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node addFiles:directory.data threadId:threadId caption:caption != nil ? caption : @"" error:error];
  if (*error) {
    return nil;
  }
  return [[Block alloc] initWithData:data error:error];
}

- (Block *)addByTarget:(NSString *)target threadId:(NSString *)threadId caption:(NSString *)caption error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node addFilesByTarget:target threadId:threadId caption:caption != nil ? caption : @"" error:error];
  if (*error) {
    return nil;
  }
  return [[Block alloc] initWithData:data error:error];
}

- (FilesList *)list:(NSString *)threadId offset:(NSString *)offset limit:(long)limit error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node files:threadId offset:offset != nil ? offset : @"" limit:limit error:error];
  if (*error) {
    return nil;
  }
  return [[FilesList alloc] initWithData:data error:error];
}

- (NSString *)data:(NSString *)hash error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node fileData:hash error:error];
}

- (NSString *)imageDataForMinWidth:(NSString *)path minWidth:(long)minWidth error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node imageFileDataForMinWidth:path minWidth:minWidth error:error];
}

@end
