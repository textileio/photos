//
//  RequestsHandler.h
//  Textile
//
//  Created by Aaron Sutula on 5/3/19.
//

#import <Foundation/Foundation.h>
#import <Mobile/Mobile.h>

NS_ASSUME_NONNULL_BEGIN

@interface RequestsHandler : NSObject <CoreCafeOutboxHandler>

@property (nonatomic, strong) MobileMobile *node;

@end

NS_ASSUME_NONNULL_END
