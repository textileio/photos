#import <Foundation/Foundation.h>
#import <Mobile/Mobile.h>

NS_ASSUME_NONNULL_BEGIN

@interface DataCallback : NSObject<MobileDataCallback>

- (instancetype)initWithCompletion:(void (^)(NSData*, NSString*, NSError*))completion;

@end

NS_ASSUME_NONNULL_END
