//
//  LogsApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/View.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Provides access to Textile logs related APIs
 */
@interface LogsApi : NodeDependant

/**
 * Set the log level for the Textile node
 * @param level Object containing a dictionary of log level for each logging system
 * @param error A reference to an error pointer that will be set in the case of an error
 */
- (void)setLevel:(LogLevel *)level error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
