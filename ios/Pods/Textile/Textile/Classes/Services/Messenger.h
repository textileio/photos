//
//  Messenger.h
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Mobile/Mobile.h>
#import "TextileApi.h"

NS_ASSUME_NONNULL_BEGIN

@interface Messenger : NSObject<MobileMessenger>

- (instancetype)initWithTextile:(Textile *)textile;

@end

NS_ASSUME_NONNULL_END
