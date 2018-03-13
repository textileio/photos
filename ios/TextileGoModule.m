#import "TextileGoModule.h"
#import <React/RCTLog.h>
#import <Mobile/Mobile.h>

@interface TextileGoModule()

@property (nonatomic, strong) MobileNode *node;

@end

@implementation TextileGoModule

RCT_EXPORT_MODULE();

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
  } else {
    RCTLogInfo(@"Success starting IPFS node!");
  }
}

@end
