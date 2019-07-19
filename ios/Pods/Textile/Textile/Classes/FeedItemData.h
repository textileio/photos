//
//  FeedItemData.h
//  Textile
//
//  Created by Aaron Sutula on 6/17/19.
//

#import <Foundation/Foundation.h>

@class Text;
@class Comment;
@class Like;
@class Files;
@class Ignore;
@class Join;
@class Leave;
@class Announce;

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSUInteger {
  FeedItemTypeText,
  FeedItemTypeComment,
  FeedItemTypeLike,
  FeedItemTypeFiles,
  FeedItemTypeIgnore,
  FeedItemTypeJoin,
  FeedItemTypeLeave,
  FeedItemTypeAnnounce
} FeedItemType;

@interface FeedItemData : NSObject

@property (nonatomic, assign) FeedItemType type;
@property (nonatomic, strong) NSString *block;
@property (nonatomic, strong) Text *text;
@property (nonatomic, strong) Comment *comment;
@property (nonatomic, strong) Like *like;
@property (nonatomic, strong) Files *files;
@property (nonatomic, strong) Ignore *ignore;
@property (nonatomic, strong) Join *join;
@property (nonatomic, strong) Leave *leave;
@property (nonatomic, strong) Announce *announce;

@end

NS_ASSUME_NONNULL_END
