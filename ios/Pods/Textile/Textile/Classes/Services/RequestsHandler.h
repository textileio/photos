//
//  RequestsHandler.h
//  Textile
//
//  Created by Aaron Sutula on 5/3/19.
//

#import <Foundation/Foundation.h>
#import "TextileApi.h"

NS_ASSUME_NONNULL_BEGIN

@interface RequestsHandler : NSObject <CoreCafeOutboxHandler>

- (instancetype)initWithTextile:(Textile *)textile;
- (void)start;

@end

NS_ASSUME_NONNULL_END
