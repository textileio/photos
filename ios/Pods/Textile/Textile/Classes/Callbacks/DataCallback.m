#import "DataCallback.h"

@interface DataCallback()

@property (nonatomic, copy, nonnull) void (^completion)(NSData*, NSString*, NSError*);

@end

@implementation DataCallback

- (instancetype)initWithCompletion:(void (^)(NSData*, NSString*, NSError*))completion {
  self = [super init];
  if (self) {
    self.completion = completion;
  }
  return self;
}

- (void)call:(NSData *)data media:(NSString *)media err:(NSError *)err {
  self.completion(data, media, err);
}

@end
