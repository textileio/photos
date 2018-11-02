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

@interface TextileNode : NSObject <RCTBridgeModule>
  // Define class properties here with @property
- (NSString *)_photoData:(NSString *)id_ path:(NSString *)path error:(NSError**)error;
- (NSString *)_photoDataForMinWidth:(NSString*)id_ minWidth:(long)minWidth error:(NSError**)error;
@end

@interface RCTBridge (TextileNode)
/**
 * The shared Textile node instance
 */
@property (nonatomic, readonly) TextileNode *textileNode;

@end
