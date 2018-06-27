#import <UIKit/UIKit.h>
#import <React/RCTResizeMode.h>

@class RCTBridge;
@class TextileImageSource;

@interface TextileImageView : UIImageView

- (instancetype)initWithBridge:(RCTBridge *)bridge NS_DESIGNATED_INITIALIZER;

@property (nonatomic, strong) NSString *imageId;
@property (nonatomic, strong) NSString *path;
@property (nonatomic, assign) RCTResizeMode resizeMode;

@end
