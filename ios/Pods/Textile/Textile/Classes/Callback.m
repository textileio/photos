//
//  Callback.m
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "Callback.h"

@interface Callback()

@property (nonatomic, copy, nonnull) void (^completion)(NSData*, NSError*);

@end

@implementation Callback

- (instancetype)initWithCompletion:(void (^)(NSData*, NSError*))completion {
  self = [super init];
  if (self) {
    self.completion = completion;
  }
  return self;
}

- (void)call:(NSData *)payload err:(NSError *)err {
  self.completion(payload, err);
}

@end
