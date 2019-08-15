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

- (Contact *)get:(NSString *)address error:(NSError * _Nullable __autoreleasing *)error {
  /*
   * contact returns an error if no contact is found.
   */
  NSData *data = [self.node contact:address error:error];
  if (*error) {
    return nil;
  }
  return [[Contact alloc] initWithData:data error:error];
}

- (ContactList *)list:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node contacts:error];
  if (*error) {
    return nil;
  }
  return [[ContactList alloc] initWithData:data error:error];
}

- (void)remove:(NSString *)address error:(NSError * _Nullable __autoreleasing *)error {
  [self.node removeContact:address error:error];
}

- (ThreadList *)threads:(NSString *)address error:(NSError * _Nullable __autoreleasing *)error {
  NSData *data = [self.node contactThreads:address error:error];
  if (*error) {
    return nil;
  }
  return [[ThreadList alloc] initWithData:data error:error];
}

- (MobileSearchHandle *)search:(ContactQuery *)query options:(QueryOptions *)options error:(NSError * _Nullable __autoreleasing *)error {
  return [self.node searchContacts:query.data options:options.data error:error];
}

@end
