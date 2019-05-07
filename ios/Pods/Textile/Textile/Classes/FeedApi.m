//
//  FeedApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "FeedApi.h"

@implementation FeedApi

- (FeedItemList *)list:(FeedRequest *)request error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node feed:request.data error:error];
  if (*error) {
    return nil;
  }
  return [[FeedItemList alloc] initWithData:data error:error];
}

@end
