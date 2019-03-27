//
//  MessagesApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/View.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

@interface MessagesApi : NodeDependant

- (NSString *)add:(NSString *)threadId body:(NSString *)body error:(NSError **)error;
- (TextList *)list:(nullable NSString *)offset limit:(long)limit threadId:(NSString *)threadId error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
