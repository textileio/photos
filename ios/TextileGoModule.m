//
//  TextileGoModule.m
//  TextilePhotos
//
//  Created by Aaron Sutula on 3/13/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "TextileGoModule.h"
#import <React/RCTLog.h>
#import <Mobile/Mobile.h>

@interface TextileGoModule()

@property (nonatomic, strong) MobileNode *node;

@end

@implementation TextileGoModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

RCT_EXPORT_METHOD(createNodeWithDataDir:(NSString *)dataDir)
{
  self.node = MobileNewTextile(dataDir);
}

RCT_EXPORT_METHOD(startNode)
{
  NSError *anyError;
  BOOL success = [self.node start:&anyError];
  if (!success) {
    RCTLogInfo(@"Failed to start node with error: %@", anyError);
  }
}

@end
