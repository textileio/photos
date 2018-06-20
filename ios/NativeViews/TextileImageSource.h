#import <Foundation/Foundation.h>

#import <React/RCTConvert.h>

/**
 * Object containing an image hash path and associated metadata.
 */
@interface TextileImageSource : NSObject

@property (nonatomic, copy, readonly) NSString *hsh; // it doesn't like "hash" here
@property (nonatomic, copy, readonly) NSString *path;
@property (nonatomic, assign, readonly) CGSize size;
@property (nonatomic, assign, readonly) CGFloat scale;

/**
 * Create a new image source object.
 * Pass a size of CGSizeZero if you do not know or wish to specify the image
 * size. Pass a scale of zero if you do not know or wish to specify the scale.
 */
- (instancetype)initWithHash:(NSString *)hash
                    withPath:(NSString *)path
                        size:(CGSize)size
                       scale:(CGFloat)scale;

/**
 * Create a copy of the image source with the specified size and scale.
 */
- (instancetype)imageSourceWithSize:(CGSize)size scale:(CGFloat)scale;

@end

@interface RCTConvert (TextileImageSource)

+ (TextileImageSource *)TextileImageSource:(id)json;
+ (NSArray<TextileImageSource *> *)TextileImageSourceArray:(id)json;

@end
