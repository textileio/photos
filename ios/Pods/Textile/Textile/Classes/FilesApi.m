//
//  FilesApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "FilesApi.h"
#import "ProtoCallback.h"
#import "DataCallback.h"

@implementation FilesApi

- (void)addData:(NSData *)data threadId:(NSString *)threadId caption:(NSString *)caption completion:(void (^)(Block * _Nullable, NSError * _Nonnull))completion {
  ProtoCallback *cb = [[ProtoCallback alloc] initWithCompletion:^(NSData *data, NSError *error) {
    if (error) {
      completion(nil, error);
    } else {
      NSError *error;
      Block *block = [[Block alloc] initWithData:data error:&error];
      completion(block, error);
    }
  }];
  [self.node addData:data threadId:threadId caption:caption cb:cb];
}

- (void)addFiles:(NSString *)files threadId:(NSString *)threadId caption:(NSString *)caption completion:(void (^)(Block * _Nullable, NSError * _Nonnull))completion {
  ProtoCallback *cb = [[ProtoCallback alloc] initWithCompletion:^(NSData *data, NSError *error) {
    if (error) {
      completion(nil, error);
    } else {
      NSError *error;
      Block *block = [[Block alloc] initWithData:data error:&error];
      completion(block, error);
    }
  }];
  [self.node addFiles:files threadId:threadId caption:caption cb:cb];
}

- (void)shareFiles:(NSString *)target threadId:(NSString *)threadId caption:(NSString *)caption completion:(void (^)(Block * _Nullable, NSError * _Nonnull))completion {
  ProtoCallback *cb = [[ProtoCallback alloc] initWithCompletion:^(NSData *data, NSError *error) {
    if (error) {
      completion(nil, error);
    } else {
      NSError *error;
      Block *block = [[Block alloc] initWithData:data error:&error];
      completion(block, error);
    }
  }];
  [self.node shareFiles:target threadId:threadId caption:caption cb:cb];
}

- (FilesList *)list:(NSString *)threadId offset:(NSString *)offset limit:(long)limit error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node files:threadId offset:offset != nil ? offset : @"" limit:limit error:error];
  if (*error) {
    return nil;
  }
  return [[FilesList alloc] initWithData:data error:error];
}

- (void)content:(NSString *)hash completion:(void (^)(NSData * _Nullable, NSString * _Nullable, NSError * _Nonnull))completion {
  DataCallback *cb = [[DataCallback alloc] initWithCompletion:^(NSData *data, NSString *media, NSError *error) {
    if (error) {
      completion(nil, nil, error);
    } else {
      NSError *error;
      completion(data, media, error);
    }
  }];
  [self.node fileContent:hash cb:cb];
}

- (void)imageContentForMinWidth:(NSString *)path minWidth:(long)minWidth completion:(void (^)(NSData * _Nullable, NSString * _Nullable, NSError * _Nonnull))completion {
  DataCallback *cb = [[DataCallback alloc] initWithCompletion:^(NSData *data, NSString *media, NSError *error) {
    if (error) {
      completion(nil, nil, error);
    } else {
      NSError *error;
      completion(data, media, error);
    }
  }];
  [self.node imageFileContentForMinWidth:path minWidth:minWidth cb:cb];
}

@end
