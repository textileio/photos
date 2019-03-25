//
//  Cafe.h
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/Model.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

@interface CafesApi : NodeDependant

- (void)register:(NSString *)host token:(NSString *)token error:(NSError **)error;
- (CafeSession *)session:(NSString *)peerId error:(NSError **)error;
- (CafeSessionList *)sessions:(NSError **)error;
- (CafeSession *)refreshSession:(NSString *)peerId error:(NSError **)error;
- (void)deregister:(NSString *)peerId error:(NSError **)error;
- (void)checkMessages:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
