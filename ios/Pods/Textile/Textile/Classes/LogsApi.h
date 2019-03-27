//
//  LogsApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/View.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

@interface LogsApi : NodeDependant

- (void)setLevel:(LogLevel *)level error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
