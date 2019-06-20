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

- (void)addData:(NSData *)data threadId:(NSString *)threadId caption:(NSString *)caption completion:(void (^)(Block * _Nullable, NSError * _Nonnull))completion {
  Callback *cb = [[Callback alloc] initWithCompletion:^(NSData *data, NSError *error) {
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

- (void)addFiles:(Strings *)files threadId:(NSString *)threadId caption:(NSString *)caption completion:(void (^)(Block * _Nullable, NSError * _Nonnull))completion {
  Callback *cb = [[Callback alloc] initWithCompletion:^(NSData *data, NSError *error) {
    if (error) {
      completion(nil, error);
    } else {
      NSError *error;
      Block *block = [[Block alloc] initWithData:data error:&error];
      completion(block, error);
    }
  }];
  [self.node addFiles:files.data threadId:threadId caption:caption cb:cb];
}

- (void)shareFiles:(NSString *)target threadId:(NSString *)threadId caption:(NSString *)caption completion:(void (^)(Block * _Nullable, NSError * _Nonnull))completion {
  Callback *cb = [[Callback alloc] initWithCompletion:^(NSData *data, NSError *error) {
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

- (NSString *)content:(NSString *)hash error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node fileContent:hash error:error];
}

- (NSString *)imageContentForMinWidth:(NSString *)path minWidth:(long)minWidth error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node imageFileContentForMinWidth:path minWidth:minWidth error:error];
}

@end
