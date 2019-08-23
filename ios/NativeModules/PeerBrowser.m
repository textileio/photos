#import "PeerBrowser.h"

@interface PeerBrowser()

@end

@implementation PeerBrowser

RCT_EXPORT_MODULE();


#pragma mark -
#pragma mark Public Methods
- (void)initialize:(NSString *)serviceType peerID:(MCPeerID *)peerID {
  self.browser = [[MCNearbyServiceBrowser alloc] initWithPeer:peerID serviceType:@"textileio"];
  self.browser.delegate = self;
  [self.browser startBrowsingForPeers];
}

#pragma mark -
#pragma mark Session Delegate Methods
- (void)browser:(nonnull MCNearbyServiceBrowser *)browser foundPeer:(nonnull MCPeerID *)peerID withDiscoveryInfo:(nullable NSDictionary<NSString *,NSString *> *)info {
//  NSDictionary *userInfo = @{ @"peerID": peerID };
//  NSDictionary *moreInfo = info;
//  dispatch_async(dispatch_get_main_queue(), ^{
//    [[NSNotificationCenter defaultCenter] postNotificationName:@"Multipeer_DidChangeStateNotification"
//                                                        object:nil
//                                                      userInfo:userInfo];
//  });
}

- (void)browser:(nonnull MCNearbyServiceBrowser *)browser lostPeer:(nonnull MCPeerID *)peerID { 
  //pass
}

@end
