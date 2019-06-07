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

/**
 * Provides access to Textile profile related APIs
 */
@interface ProfileApi : NodeDependant

/**
 * Get the Peer object associated with the local Textile peer
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The Peer object associated with the local Textile peer
 */
- (Peer *)get:(NSError **)error;

/**
 * Get the user name associated with the local Textile peer
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The user name associated with the local Textile peer
 */
- (NSString *)name:(NSError **)error;

/**
 * Set the user name
 * @param name The new user name
 * @param error A reference to an error pointer that will be set in the case of an error
 */
- (void)setName:(NSString *)name error:(NSError **)error;

/**
 * Get the target of the profile avatar
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The target of the avatar
 */
- (NSString *)avatar:(NSError **)error;

/**
 * Get the Textile account thread
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The account thread
 */
- (Thread *)accountThread:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
