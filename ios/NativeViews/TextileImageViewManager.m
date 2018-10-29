#import "TextileImageViewManager.h"

#import <UIKit/UIKit.h>

#import <React/RCTConvert.h>

#import "TextileImageView.h"
#import "TextileNode.h"

@implementation TextileImageViewManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[TextileImageView alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(imageId, NSString)
RCT_EXPORT_VIEW_PROPERTY(forMinWidth, int)
RCT_EXPORT_VIEW_PROPERTY(resizeMode, RCTResizeMode)
RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock)

@end
