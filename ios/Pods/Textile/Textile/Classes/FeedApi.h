//
//  FeedApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/View.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

@interface FeedApi : NodeDependant

- (FeedItemList *)list:(FeedRequest *)request error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
