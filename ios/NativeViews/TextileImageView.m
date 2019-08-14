#import "TextileImageView.h"
#import <React/RCTBridge.h>
#import <Textile/TextileApi.h>

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
    self.clipsToBounds = true;
  }
  return self;
}

- (void)setTarget:(NSString *)target {
  if (_target != target) {
    _target = target;
  }
  self.needsRenderImage = true;
}

- (void)setIpfs:(BOOL)ipfs {
  if (_ipfs != ipfs) {
    _ipfs = ipfs;
  }
  self.needsRenderImage = true;
}

- (void)setIndex:(int)index {
  if (_index != index) {
    _index = index;
    self.needsRenderImage = true;
  }
}

- (void)setForMinWidth:(int)forMinWidth {
  if (_forMinWidth != forMinWidth) {
    _forMinWidth = forMinWidth;
    self.needsRenderImage = true;
  }
}

- (void)setResizeMode:(RCTResizeMode)resizeMode {
  if (_resizeMode != resizeMode) {
    _resizeMode = resizeMode;
    self.needsRenderResizeMode = true;
  }
}

- (void)processData:(NSData *)data error:(NSError *)error {
  dispatch_async(dispatch_get_main_queue(), ^{
    if (data) {
      UIImage *image = [UIImage imageWithData:data scale:1];
      super.image = image;
      self.needsRenderImage = false;
      if (self.onLoad) {
        self.onLoad(@{});
      }
    } else {
      if (self.onError) {
        self.onError(@{ @"message" : error.localizedDescription });
      }
    }
  });
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
    if (self.ipfs) {
      [Textile.instance.ipfs dataAtPath:self.target completion:^(NSData * _Nullable data, NSString * _Nullable media, NSError * _Nonnull error) {
        [self processData:data error:error];
      }];
    } else {
      NSString *path = [NSString stringWithFormat:@"%@/%d", self.target, self.index];
      [Textile.instance.files imageContentForMinWidth:path minWidth:self.forMinWidth completion:^(NSData * _Nullable data, NSString * _Nullable media, NSError * _Nonnull error) {
        [self processData:data error:error];
      }];
    }
  }
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps {
  [self render];
}

@end

