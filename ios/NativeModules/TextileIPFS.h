//  Created by react-native-create-bridge

// import RCTBridgeModule
#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#elif __has_include("RCTBridgeModule.h")
#import “RCTBridgeModule.h”
#else
#import "React/RCTBridgeModule.h" // Required when used as a Pod in a Swift project
#endif

#import <React/RCTBridge.h>

@interface TextileIPFS : NSObject <RCTBridgeModule>
  // Define class properties here with @property
- (NSString *)_getHashData:(NSString *)hashPath error:(NSError**)error;
@end

@interface RCTBridge (TextileIPFS)
/**
 * The shared ipfs instance
 */
@property (nonatomic, readonly) TextileIPFS *ipfs;

@end
