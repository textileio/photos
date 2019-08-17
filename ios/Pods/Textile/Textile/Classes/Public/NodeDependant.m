//
//  ApiModule.m
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "NodeDependant.h"

@implementation NodeDependant

- (instancetype)initWithNode:(MobileMobile *)node {
  if (self = [super init]) {
    self.node = node;
  }
  return self;
}

@end
