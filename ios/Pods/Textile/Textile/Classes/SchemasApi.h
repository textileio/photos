//
//  SchemasApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/8/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/Model.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Provides access to Textile schemas related APIs
 */
@interface SchemasApi : NodeDependant

/**
 * Add a new schema
 * @param schemaNode The node that describes the new schema to add
 * @param error A reference to an error pointer that will be set in the case of an error
 * @return The FileIndex representing the added schema
 */
- (FileIndex *)add:(Node *)schemaNode error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
