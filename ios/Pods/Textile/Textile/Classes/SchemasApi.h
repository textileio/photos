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

@interface SchemasApi : NodeDependant

- (FileIndex *)add:(Node *)schemaNode error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
