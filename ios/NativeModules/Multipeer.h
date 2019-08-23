#import <Foundation/Foundation.h>
//#import <React/RCTBridgeModule.h>
#import <MultipeerConnectivity/MultipeerConnectivity.h>
#import "PeerBrowser.h"

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#elif __has_include("RCTBridgeModule.h")
#import “RCTBridgeModule.h”
#else
#import "React/RCTBridgeModule.h"
#endif
#import <React/RCTBridge.h>

@interface Multipeer : NSObject <MCSessionDelegate, RCTBridgeModule>

@property (nonatomic, strong) NSString *name;
@property (nonatomic, strong) NSString *address;
@property (nonatomic, strong) NSString *avatar;
@property (nonatomic, strong) MCPeerID *peerID;
@property (nonatomic, strong) MCSession *session;
//@property (nonatomic, strong) MCBrowserViewController *browser;
@property (nonatomic, strong) PeerBrowser *browser;
@property (nonatomic, strong) MCAdvertiserAssistant *advertiser;

- (void)initialize:(NSString *)name address:(NSString *)address avatar:(NSString *)avatar;
- (void)advertiseToggle:(BOOL)onOff;
- (void)scanStart;

@end

@interface RCTBridge (Multipeer)

@property (nonatomic, readonly) Multipeer *multipeer;

@end
