//
//  InvitesApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/View.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

@interface InvitesApi : NodeDependant

- (NSString *)add:(NSString *)threadId inviteeId:(NSString *)inviteeId error:(NSError **)error;
- (NewInvite *)addExternal:(NSString *)threadId error:(NSError **)error;
- (NSString *)acceptExternal:(NSString *)inviteId key:(NSString *)key error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
