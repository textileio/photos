//
//  ProfileApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/Model.pbobjc.h>
#import <TextileCore/View.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

@interface ProfileApi : NodeDependant

- (Peer *)get:(NSError **)error;
- (NSString *)name:(NSError **)error;
- (void)setName:(NSString *)name error:(NSError **)error;
- (NSString *)avatar:(NSError **)error;
- (Block *)setAvatar:(Directory *)directory error:(NSError **)error;
- (Block *)setAvatarByTarget:(NSString *)hash error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
