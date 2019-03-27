//
//  ThreadsApi.h
//  Textile
//
//  Created by Aaron Sutula on 3/1/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import <TextileCore/Model.pbobjc.h>
#import <TextileCore/View.pbobjc.h>
#import "NodeDependant.h"

NS_ASSUME_NONNULL_BEGIN

@interface ThreadsApi : NodeDependant

- (Thread *)add:(AddThreadConfig *)config error:(NSError **)error;
- (void)addOrUpdate:(Thread *)thrd error:(NSError **)error;
- (void)rename:(NSString *)threadId name:(NSString *)name error:(NSError **)error;
- (Thread *)get:(NSString *)threadId error:(NSError **)error;
- (ThreadList *)list:(NSError **)error;
- (ContactList *)peers:(NSString *)threadId error:(NSError **)error;
- (NSString *)remove:(NSString *)threadId error:(NSError **)error;

@end

NS_ASSUME_NONNULL_END
