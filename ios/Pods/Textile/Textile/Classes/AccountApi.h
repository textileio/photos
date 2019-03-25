//
//  Account.h
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/Model.pbobjc.h>
#import <TextileCore/Query.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

@interface AccountApi : NodeDependant

- (NSString *)address;
- (NSString *)seed;
- (nullable NSData *)encrypt:(NSData *)data error:(NSError **)error;
- (nullable NSData *)decrypt:(NSData *)data error:(NSError **)error;
- (ContactList *)peers:(NSError **)error;
- (MobileSearchHandle *)findThreadBackups:(ThreadBackupQuery *)query options:(QueryOptions *)options error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
