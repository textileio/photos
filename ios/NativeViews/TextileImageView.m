#import "TextileImageView.h"
#import <React/RCTBridge.h>
#import "TextileNode.h"

@interface TextileImageView ()

@property (nonatomic, assign) Boolean needsRenderResizeMode;
@property (nonatomic, assign) Boolean needsRenderImage;

@end

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

- (void)setImageId:(NSString *)imageId {
  if (_imageId != imageId) {
    _imageId = imageId;
    self.needsRenderImage = true;
  }
}

- (void)setPath:(NSString *)path {
  if (_path != path) {
    _path = path;
    self.needsRenderImage = true;
  }
}

- (void)setResizeMode:(RCTResizeMode)resizeMode {
  if (_resizeMode != resizeMode) {
    _resizeMode = resizeMode;
    self.needsRenderResizeMode = true;
  }
}

- (void)render {
  if (self.needsRenderResizeMode) {
    if (self.resizeMode == RCTResizeModeRepeat) {
      // Repeat resize mode is handled by the UIImage. Use scale to fill
      // so the repeated image fills the UIImageView.
      self.contentMode = UIViewContentModeScaleToFill;
    } else {
      self.contentMode = (UIViewContentMode)(self.resizeMode);
    }
    self.needsRenderResizeMode = false;
  }

  if (self.needsRenderImage) {
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
      NSError *error;
      UIImage *image;
      NSString *base64String = [_bridge.textileNode _getPhotoData:self.imageId withPath:self.path error:&error];
      if (base64String) {
        NSString *finalBase64String = [@"data:image/jpeg;base64," stringByAppendingString:base64String];
        NSURL *url = [NSURL URLWithString:finalBase64String];
        NSData *imageData = [NSData dataWithContentsOfURL:url];
        image = [UIImage imageWithData:imageData];
      }
      dispatch_async(dispatch_get_main_queue(), ^{
        if (error) {
          if (self.onError) {
            self.onError(@{ @"message" : error.localizedDescription });
          }
        } else {
          super.image = image;
          if (self.onLoad) {
            self.onLoad(@{});
          }
        }
      });
    });
    self.needsRenderImage = false;
  }
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps {
  [self render];
}

@end

