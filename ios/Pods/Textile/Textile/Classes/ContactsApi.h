//
//  ContactsApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/Model.pbobjc.h>
#import <TextileCore/Query.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

@interface ContactsApi : NodeDependant

- (void)add:(Contact *)contact error:(NSError **)error;
- (Contact *)get:(NSString *)contactId error:(NSError **)error;
- (ContactList *)list:(NSError **)error;
- (void)remove:(NSString *)contactId error:(NSError **)error;
- (ThreadList *)threads:(NSString *)contactId error:(NSError **)error;
- (MobileSearchHandle *)search:(ContactQuery *)query options:(QueryOptions *)options error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
