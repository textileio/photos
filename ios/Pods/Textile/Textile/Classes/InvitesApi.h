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

- (void)add:(NSString *)threadId address:(NSString *)address error:(NSError **)error;
- (ExternalInvite *)addExternal:(NSString *)threadId error:(NSError **)error;
- (InviteViewList *)list:(NSError **)error;
- (NSString *)accept:(NSString *)inviteId error:(NSError **)error;
- (NSString *)acceptExternal:(NSString *)inviteId key:(NSString *)key error:(NSError **)error;
- (void)ignore:(NSString *)inviteId error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
