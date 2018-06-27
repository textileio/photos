#import "TextileImageView.h"
#import <React/RCTBridge.h>
#import "TextileNode.h"

@implementation TextileImageView {
  // Weak reference back to the bridge, for image loading
  __weak RCTBridge *_bridge;
}

RCT_NOT_IMPLEMENTED(- (instancetype)init)

- (instancetype)initWithBridge:(RCTBridge *)bridge {
  if ((self = [super init])) {
    _bridge = bridge;
  }
  return self;
}

- (void)render {
  if (self.resizeMode == RCTResizeModeRepeat) {
    // Repeat resize mode is handled by the UIImage. Use scale to fill
    // so the repeated image fills the UIImageView.
    self.contentMode = UIViewContentModeScaleToFill;
  } else {
    self.contentMode = (UIViewContentMode)(self.resizeMode);
  }
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    NSError *error;
    UIImage *image;
    NSString *base64String = [_bridge.textileNode _getFileData:self.imageId withPath:self.path error:&error];
    if (base64String) {
      NSString *finalBase64String = [@"data:image/jpeg;base64," stringByAppendingString:base64String];
      NSURL *url = [NSURL URLWithString:finalBase64String];
      NSData *imageData = [NSData dataWithContentsOfURL:url];
      image = [UIImage imageWithData:imageData];
    }
    dispatch_async(dispatch_get_main_queue(), ^{
      super.image = image;
    });
  });
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps {
  [self render];
}

@end

