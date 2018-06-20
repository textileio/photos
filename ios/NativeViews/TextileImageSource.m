#import "TextileImageSource.h"

@interface TextileImageSource ()

@property (nonatomic, assign) BOOL packagerAsset;

@end

@implementation TextileImageSource

- (instancetype)initWithHash:(NSString *)hash withPath:(NSString *)path size:(CGSize)size scale:(CGFloat)scale
{
  if ((self = [super init])) {
    _hsh = [hash copy];
    _path = [path copy];
    _size = size;
    _scale = scale;
  }
  return self;
}

- (instancetype)imageSourceWithSize:(CGSize)size scale:(CGFloat)scale
{
  TextileImageSource *imageSource = [[TextileImageSource alloc] initWithHash:_hsh
                                                                    withPath:_path
                                                                        size:size
                                                                       scale:scale];
  imageSource.packagerAsset = _packagerAsset;
  return imageSource;
}

- (BOOL)isEqual:(TextileImageSource *)object
{
  if (![object isKindOfClass:[TextileImageSource class]]) {
    return NO;
  }
  return [_hsh isEqual:object.hsh] && [_path isEqual:object.path] && _scale == object.scale &&
  (CGSizeEqualToSize(_size, object.size) || CGSizeEqualToSize(object.size, CGSizeZero));
}

- (NSString *)description
{
  return [NSString stringWithFormat:@"<TextileImageSource: %p hash=%@, path=%@, size=%@, scale=%0.f>",
          self, _hsh, _path, NSStringFromCGSize(_size), _scale];
}

@end

@implementation RCTConvert (ImageSource)

+ (TextileImageSource *)TextileImageSource:(id)json
{
  if (!json) {
    return nil;
  }

  NSString *hash;
  NSString *path;
  CGSize size = CGSizeZero;
  CGFloat scale = 1.0;
  BOOL packagerAsset = NO;
  if ([json isKindOfClass:[NSDictionary class]]) {
    hash = [self NSString:json[@"hash"]];
    path = [self NSString:json[@"path"]];
    size = [self CGSize:json];
    scale = [self CGFloat:json[@"scale"]] ?: [self BOOL:json[@"deprecated"]] ? 0.0 : 1.0;
    packagerAsset = [self BOOL:json[@"__packager_asset"]];
  } else {
    RCTLogConvertError(json, @"Can't convert json to an TextileImageSource");
    return nil;
  }

  TextileImageSource *imageSource = [[TextileImageSource alloc] initWithHash:hash
                                                                    withPath:path
                                                                        size:size
                                                                       scale:scale];
  imageSource.packagerAsset = packagerAsset;
  return imageSource;
}

RCT_ARRAY_CONVERTER(TextileImageSource)

@end

