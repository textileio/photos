#import "IpfsImageSource.h"

@interface IpfsImageSource ()

@property (nonatomic, assign) BOOL packagerAsset;

@end

@implementation IpfsImageSource

- (instancetype)initWithHashPath:(NSString *)hashPath size:(CGSize)size scale:(CGFloat)scale
{
  if ((self = [super init])) {
    _hashPath = [hashPath copy];
    _size = size;
    _scale = scale;
  }
  return self;
}

- (instancetype)imageSourceWithSize:(CGSize)size scale:(CGFloat)scale
{
  IpfsImageSource *imageSource = [[IpfsImageSource alloc] initWithHashPath:_hashPath
                                                                      size:size
                                                                     scale:scale];
  imageSource.packagerAsset = _packagerAsset;
  return imageSource;
}

- (BOOL)isEqual:(IpfsImageSource *)object
{
  if (![object isKindOfClass:[IpfsImageSource class]]) {
    return NO;
  }
  return [_hashPath isEqual:object.hashPath] && _scale == object.scale &&
  (CGSizeEqualToSize(_size, object.size) || CGSizeEqualToSize(object.size, CGSizeZero));
}

- (NSString *)description
{
  return [NSString stringWithFormat:@"<IpfsImageSource: %p hashPath=%@, size=%@, scale=%0.f>",
          self, _hashPath, NSStringFromCGSize(_size), _scale];
}

@end

@implementation RCTConvert (ImageSource)

+ (IpfsImageSource *)IpfsImageSource:(id)json
{
  if (!json) {
    return nil;
  }

  NSString *hashPath;
  CGSize size = CGSizeZero;
  CGFloat scale = 1.0;
  BOOL packagerAsset = NO;
  if ([json isKindOfClass:[NSDictionary class]]) {
    hashPath = [self NSString:json[@"hashPath"]];
    size = [self CGSize:json];
    scale = [self CGFloat:json[@"scale"]] ?: [self BOOL:json[@"deprecated"]] ? 0.0 : 1.0;
    packagerAsset = [self BOOL:json[@"__packager_asset"]];
  } else if ([json isKindOfClass:[NSString class]]) {
    hashPath = [self NSString:json];
  } else {
    RCTLogConvertError(json, @"Can't convert json to an IpfsImageSource");
    return nil;
  }

  IpfsImageSource *imageSource = [[IpfsImageSource alloc] initWithHashPath:hashPath
                                                                      size:size
                                                                     scale:scale];
  imageSource.packagerAsset = packagerAsset;
  return imageSource;
}

RCT_ARRAY_CONVERTER(IpfsImageSource)

@end

