#import <UIKit/UIKit.h>

#import <React/RCTResizeMode.h>

@class RCTBridge;
@class IpfsImageSource;

@interface IpfsImageView : UIImageView

- (instancetype)initWithBridge:(RCTBridge *)bridge NS_DESIGNATED_INITIALIZER;

@property (nonatomic, assign) UIEdgeInsets capInsets;
@property (nonatomic, strong) UIImage *defaultImage;
@property (nonatomic, assign) UIImageRenderingMode renderingMode;
@property (nonatomic, copy) NSArray<IpfsImageSource *> *imageSources;
@property (nonatomic, assign) CGFloat blurRadius;
@property (nonatomic, assign) RCTResizeMode resizeMode;

@end
