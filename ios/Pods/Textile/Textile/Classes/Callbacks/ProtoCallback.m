#import "ProtoCallback.h"

@interface ProtoCallback()

@property (nonatomic, copy, nonnull) void (^completion)(NSData*, NSError*);

@end

@implementation ProtoCallback

- (instancetype)initWithCompletion:(void (^)(NSData*, NSError*))completion {
  self = [super init];
  if (self) {
    self.completion = completion;
  }
  return self;
}

- (void)call:(NSData *)data err:(NSError *)err {
  self.completion(data, err);
}

@end
