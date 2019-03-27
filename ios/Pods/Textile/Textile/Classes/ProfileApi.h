//
//  ProfileApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/Model.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

@interface ProfileApi : NodeDependant

- (Contact *)get:(NSError **)error;
- (NSString *)username:(NSError **)error;
- (void)setUsername:(NSString *)username error:(NSError **)error;
- (NSString *)avatar:(NSError **)error;
- (void)setAvatar:(NSString *)hash error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
