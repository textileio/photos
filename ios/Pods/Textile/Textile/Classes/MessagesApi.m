//
//  MessagesApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "MessagesApi.h"

@implementation MessagesApi

- (NSString *)add:(NSString *)threadId body:(NSString *)body error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node addMessage:threadId body:body error:error];
}

- (TextList *)list:(NSString *)offset limit:(long)limit threadId:(NSString *)threadId error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node messages:offset != nil ? offset : @"" limit:limit threadId:threadId error:error];
  return [[TextList alloc] initWithData:data error:error];
}

@end
