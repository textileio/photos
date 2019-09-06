//
//  Callback.m
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "Callback.h"

@interface Callback()

@property (nonatomic, copy, nonnull) void (^completion)(NSError * _Nullable);

@end

@implementation Callback

- (instancetype)initWithCompletion:(void (^)(NSError * _Nullable))completion {
  self = [super init];
  if (self) {
    self.completion = completion;
  }
  return self;
}

- (void)call:(NSError *)err {
  self.completion(err);
}

@end
