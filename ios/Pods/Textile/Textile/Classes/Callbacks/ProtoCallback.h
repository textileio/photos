#import <Foundation/Foundation.h>
#import <Mobile/Mobile.h>

NS_ASSUME_NONNULL_BEGIN

@interface ProtoCallback : NSObject<MobileProtoCallback>

- (instancetype)initWithCompletion:(void (^)(NSData*, NSError*))completion;

@end

NS_ASSUME_NONNULL_END
