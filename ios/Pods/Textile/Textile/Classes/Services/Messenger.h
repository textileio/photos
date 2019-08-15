//
//  Messenger.h
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Mobile/Mobile.h>
#import "TextileDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface Messenger : NSObject<MobileMessenger>

@property (nonatomic, weak, nullable) id<TextileDelegate> delegate;

@end

NS_ASSUME_NONNULL_END
