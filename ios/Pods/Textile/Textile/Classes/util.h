//
//  util.h
//  Textile
//
//  Created by Aaron Sutula on 6/17/19.
//

#import "FeedItemData.h"

#ifndef util_h
#define util_h

static inline FeedItemData * feedItemData(FeedItem *feedItem) {
  FeedItemData *feedItemData;
  if ([feedItem.payload.typeURL isEqualToString:@"/Text"]) {
    NSError *e;
    Text *text = [[Text alloc] initWithData:feedItem.payload.value error:&e];
    if (!e) {
      feedItemData = [[FeedItemData alloc] init];
      feedItemData.block = feedItem.block;
      feedItemData.type = FeedItemTypeText;
      feedItemData.text = text;
    }
  } else if ([feedItem.payload.typeURL isEqualToString:@"/Comment"]) {
    NSError *e;
    Comment *comment = [[Comment alloc] initWithData:feedItem.payload.value error:&e];
    if (!e) {
      feedItemData = [[FeedItemData alloc] init];
      feedItemData.block = feedItem.block;
      feedItemData.type = FeedItemTypeComment;
      feedItemData.comment = comment;
    }
  } else if ([feedItem.payload.typeURL isEqualToString:@"/Like"]) {
    NSError *e;
    Like *like = [[Like alloc] initWithData:feedItem.payload.value error:&e];
    if (!e) {
      feedItemData = [[FeedItemData alloc] init];
      feedItemData.block = feedItem.block;
      feedItemData.type = FeedItemTypeLike;
      feedItemData.like = like;
    }
  } else if ([feedItem.payload.typeURL isEqualToString:@"/Files"]) {
    NSError *e;
    Files *files = [[Files alloc] initWithData:feedItem.payload.value error:&e];
    if (!e) {
      feedItemData = [[FeedItemData alloc] init];
      feedItemData.block = feedItem.block;
      feedItemData.type = FeedItemTypeFiles;
      feedItemData.files = files;
    }
  } else if ([feedItem.payload.typeURL isEqualToString:@"/Ignore"]) {
    NSError *e;
    Ignore *ignore = [[Ignore alloc] initWithData:feedItem.payload.value error:&e];
    if (!e) {
      feedItemData = [[FeedItemData alloc] init];
      feedItemData.block = feedItem.block;
      feedItemData.type = FeedItemTypeIgnore;
      feedItemData.ignore = ignore;
    }
  } else if ([feedItem.payload.typeURL isEqualToString:@"/Join"]) {
    NSError *e;
    Join *join = [[Join alloc] initWithData:feedItem.payload.value error:&e];
    if (!e) {
      feedItemData = [[FeedItemData alloc] init];
      feedItemData.block = feedItem.block;
      feedItemData.type = FeedItemTypeJoin;
      feedItemData.join = join;
    }
  } else if ([feedItem.payload.typeURL isEqualToString:@"/Leave"]) {
    NSError *e;
    Leave *leave = [[Leave alloc] initWithData:feedItem.payload.value error:&e];
    if (!e) {
      feedItemData = [[FeedItemData alloc] init];
      feedItemData.block = feedItem.block;
      feedItemData.type = FeedItemTypeLeave;
      feedItemData.leave = leave;
    }
  }
  return feedItemData;
}

#endif /* util_h */
