//
//  FeedApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "FeedApi.h"
#import "util.h"

@implementation FeedApi

- (NSArray<FeedItemData *> *)list:(FeedRequest *)request error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node feed:request.data error:error];
  if (*error) {
    return nil;
  }
  FeedItemList *list = [[FeedItemList alloc] initWithData:data error:error];
  NSMutableArray<FeedItemData *> *feedItemDatas = [NSMutableArray arrayWithCapacity:list.itemsArray.count];
  for (FeedItem *item in list.itemsArray) {
    FeedItemData *data = feedItemData(item);
    if (data) {
      [feedItemDatas addObject:data];
    }
  }
  return [feedItemDatas copy];
}

@end
