//
//  ContactsApi.m
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "ContactsApi.h"

@implementation ContactsApi

- (void)add:(Contact *)contact error:(NSError * _Nullable __autoreleasing *)error {
  [self.node addContact:contact.data error:error];
}

- (Contact *)get:(NSString *)contactId error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node contact:contactId error:error];
  return [[Contact alloc] initWithData:data error:error];
}

- (ContactList *)list:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node contacts:error];
  return [[ContactList alloc] initWithData:data error:error];
}

- (void)remove:(NSString *)contactId error:(NSError * _Nullable __autoreleasing *)error {
  [self.node removeContact:contactId error:error];
}

- (ThreadList *)threads:(NSString *)contactId error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node contactThreads:contactId error:error];
  return [[ThreadList alloc] initWithData:data error:error];
}

- (MobileSearchHandle *)search:(ContactQuery *)query options:(QueryOptions *)options error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node searchContacts:query.data options:options.data error:error];
}

@end
