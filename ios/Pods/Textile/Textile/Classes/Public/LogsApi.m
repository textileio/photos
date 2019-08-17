//
//  LogsApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "LogsApi.h"

@implementation LogsApi

- (void)setLevel:(LogLevel *)level error:(NSError * _Nullable __autoreleasing *)error {
  [self.node setLogLevel:level.data error:error];
}

@end
