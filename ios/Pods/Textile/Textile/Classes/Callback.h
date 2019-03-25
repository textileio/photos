//
//  Callback.h
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Mobile/Mobile.h>

NS_ASSUME_NONNULL_BEGIN

@interface Callback : NSObject<MobileCallback>

- (instancetype)initWithCompletion:(void (^)(NSData*, NSError*))completion;

@end

NS_ASSUME_NONNULL_END
