// Objective-C API for talking to github.com/textileio/textile-go/net Go package.
//   gobind -lang=objc github.com/textileio/textile-go/net
//
// File is generated by gobind. Do not edit.

#ifndef __Net_H__
#define __Net_H__

@import Foundation;
#include "Universe.objc.h"


@class NetMultipartRequest;

@interface NetMultipartRequest : NSObject <goSeqRefInterface> {
}
@property(strong, readonly) id _ref;

- (instancetype)initWithRef:(id)ref;
- (instancetype)init;
- (NSString*)boundary;
- (void)setBoundary:(NSString*)v;
- (NSString*)payloadPath;
- (void)setPayloadPath:(NSString*)v;
- (BOOL)addFile:(NSData*)b fname:(NSString*)fname error:(NSError**)error;
- (BOOL)finish:(NSError**)error;
- (void)init_:(NSString*)dir boundary:(NSString*)boundary;
- (NSString*)send:(NSString*)url error:(NSError**)error;
@end

#endif
