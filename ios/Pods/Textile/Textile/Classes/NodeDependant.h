//
//  ApiModule.h
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Mobile/Mobile.h>

NS_ASSUME_NONNULL_BEGIN

@interface NodeDependant : NSObject

@property (nonatomic, strong) MobileMobile *node;

- (instancetype)initWithNode:(MobileMobile *)node;

@end

NS_ASSUME_NONNULL_END
