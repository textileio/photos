#import "Multipeer.h"

@interface Multipeer()

@end

@implementation Multipeer

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(init:(NSString *)name address:(NSString *)address avatar:(NSString *)avatar) {
  [self initialize:name address:address avatar:avatar];
}

RCT_EXPORT_METHOD(advertiseOn) {
  [self advertiseToggle:true];
}

RCT_EXPORT_METHOD(advertiseOff) {
  [self advertiseToggle:false];
}

RCT_EXPORT_METHOD(scan) {
  [self scanStart];
}

#pragma mark -
#pragma mark Public Methods
- (void)initialize:(NSString *)name address:(NSString *)address avatar:(NSString *)avatar {
  self.name = name;
  self.address = address;
  self.avatar = avatar;
  self.peerID = [[MCPeerID alloc] initWithDisplayName:address];
  self.session = [[MCSession alloc] initWithPeer:self.peerID];
  self.session.delegate = self;
}

- (void)scanStart {
  self.browser = [[PeerBrowser alloc] init];
  [self.browser initialize:@"textileio" peerID:self.peerID];
}

- (void)advertiseToggle:(BOOL)advertise {
  if (advertise) {
    NSDictionary *discoveryInfo = @{ @"address": self.address, @"avatar": self.avatar, @"name": self.name };
    self.advertiser = [[MCAdvertiserAssistant alloc] initWithServiceType:@"textileio" discoveryInfo:discoveryInfo session:self.session];
    [self.advertiser start];
  } else {
    [self.advertiser stop];
    self.advertiser = nil;
  }
}

#pragma mark -
#pragma mark Session Delegate Methods
- (void)session:(MCSession *)session peer:(MCPeerID *)peerID didChangeState:(MCSessionState)state {
//  NSDictionary *userInfo = @{ @"peerID": peerID,
//                              @"state" : @(state) };
//  dispatch_async(dispatch_get_main_queue(), ^{
//    [[NSNotificationCenter defaultCenter] postNotificationName:@"Multipeer_DidChangeStateNotification"
//                                                        object:nil
//                                                      userInfo:userInfo];
//  });
}

- (void)session:(MCSession *)session didReceiveData:(NSData *)data fromPeer:(MCPeerID *)peerID {
//  NSDictionary *userInfo = @{ @"data": data,
//                              @"peerID": peerID };
//  dispatch_async(dispatch_get_main_queue(), ^{
//    [[NSNotificationCenter defaultCenter] postNotificationName:@"Multipeer_DidReceiveDataNotification"
//                                                        object:nil
//                                                      userInfo:userInfo];
//  });
}

- (void)session:(MCSession *)session didStartReceivingResourceWithName:(NSString *)resourceName fromPeer:(MCPeerID *)peerID withProgress:(NSProgress *)progress {

}

- (void)session:(MCSession *)session didFinishReceivingResourceWithName:(NSString *)resourceName fromPeer:(MCPeerID *)peerID atURL:(NSURL *)localURL withError:(NSError *)error {

}

- (void)session:(MCSession *)session didReceiveStream:(NSInputStream *)stream withName:(NSString *)streamName fromPeer:(MCPeerID *)peerID {

}

@end
