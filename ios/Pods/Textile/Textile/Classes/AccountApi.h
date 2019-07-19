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

/**
 * Provides access to Textile account related APIs
 */
@interface AccountApi : NodeDependant

/**
 * @return The address of the Textile account
 */
- (NSString *)address;

/**
 * @return The seed of the Textile account
 */
- (NSString *)seed;

/**
 * Encrypt raw data with the account private key
 * @param data The data to encrypt
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The encrypted data
 */
- (nullable NSData *)encrypt:(NSData *)data error:(NSError **)error;

/**
 * Decrypt encrypted data using the account private key
 * @param data The encrypted data
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The decrypted data
 */
- (nullable NSData *)decrypt:(NSData *)data error:(NSError **)error;

/**
 * @param error Error a reference to an error pointer that will be set in the case of an error
 * @return The Contact object representing the Textile account
 */
- (Contact *)contact:(NSError **)error;

/**
 * Syncs the local node account with all thread snapshots found on the network
 * @param options The query options to configure the behavior of the account sync
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return A handle that can be used to cancel the account sync
 */
- (MobileSearchHandle *)sync:(QueryOptions *)options error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
