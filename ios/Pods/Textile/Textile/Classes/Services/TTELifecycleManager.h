#import "TextileApi.h"

#ifndef TTELifecycleManager_h
#define TTELifecycleManager_h

@protocol TTELifecycleManager <NSObject>

- (instancetype _Nonnull)initWithTextile:(Textile *_Nonnull)textile;
- (BOOL)start:(NSError* _Nullable* _Nullable)error;
- (void)stopWithCompletion:(nullable void (^)(BOOL success, NSError * _Nullable error))completion;

@end


#endif /* TTELifecycleManager_h */
