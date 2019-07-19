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

/**
 * Provides access to Textile contacts related APIs
 */
@interface ContactsApi : NodeDependant

/**
 * Add a new Contact to the account's list of Contacts
 * @param contact The new contact to add, usually returned from a Contact search
 * @param error A reference to an error pointer that will be set in the case of an error
 */
- (void)add:(Contact *)contact error:(NSError **)error;

/**
 * Get a Contact by address from list of existing Contacts
 * @param address The address of the Contact to retrieve
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The Contact object corresponding to the address
 */
- (Contact *)get:(NSString *)address error:(NSError **)error;

/**
 * List all existing account Contacts
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return An object containing a list of all account contacts
 */
- (ContactList *)list:(NSError **)error;

/**
 * Remove a Contact from the account by address
 * @param address The address of the contact to remove
 * @param error A reference to an error pointer that will be set in the case of an error
 */
- (void)remove:(NSString *)address error:(NSError **)error;

/**
 * List all threads a particular contact and the local node account participate in
 * @param address The contact address to find threads for
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return An object containing a list of all threads the contact and the local node account participate in
 */
- (ThreadList *)threads:(NSString *)address error:(NSError **)error;

/**
 * Search for Textile Contacts across the entire network
 * @param query A query object describing the search to execute
 * @param options A query options object to control the behavior of the search
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return A handle that can be used to cancel the search
 */
- (MobileSearchHandle *)search:(ContactQuery *)query options:(QueryOptions *)options error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
