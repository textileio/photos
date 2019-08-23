#import <Foundation/Foundation.h>
//#import <React/RCTBridgeModule.h>
#import <MultipeerConnectivity/MultipeerConnectivity.h>

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#elif __has_include("RCTBridgeModule.h")
#import “RCTBridgeModule.h”
#else
#import "React/RCTBridgeModule.h"
#endif
#import <React/RCTBridge.h>

@interface PeerBrowser : NSObject <MCNearbyServiceBrowserDelegate, RCTBridgeModule>

@property (nonatomic, strong) MCNearbyServiceBrowser *browser;
//@property (nonatomic, strong) MCPeerID *peerID;
//@property (nonatomic, strong) MCSession *session;
//@property (nonatomic, strong) MCBrowserViewController *browser;
//@property (nonatomic, strong) MCNearbyServiceBrowser *browser;
//@property (nonatomic, strong) MCAdvertiserAssistant *advertiser;

- (void)initialize:(NSString *)serviceType peerID:(MCPeerID *)peerID;


@end

@interface RCTBridge (PeerBrowser)

@property (nonatomic, readonly) PeerBrowser *peerBrowser;

@end
