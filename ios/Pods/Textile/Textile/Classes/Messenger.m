//
//  Messenger.m
//  Textile
//
//  Created by Aaron Sutula on 2/28/19.
//  Copyright © 2019 Textile. All rights reserved.
//

#import "Messenger.h"
#import <TextileCore/Mobile.pbobjc.h>
#import <TextileCore/Query.pbobjc.h>
#import <TextileCore/Message.pbobjc.h>

@implementation Messenger

- (void)notify: (MobileEvent *)event {
  if ([event.name isEqual: @"NODE_START"]) {
    if ([self.delegate respondsToSelector:@selector(nodeStarted)]) {
      [self.delegate nodeStarted];
    }
  } else if ([event.name isEqual: @"NODE_STOP"]) {
    if ([self.delegate respondsToSelector:@selector(nodeStopped)]) {
      [self.delegate nodeStopped];
    }
  } else if ([event.name isEqual: @"NODE_ONLINE"]) {
    if ([self.delegate respondsToSelector:@selector(nodeOnline)]) {
      [self.delegate nodeOnline];
    }
  } else if ([event.name isEqual: @"WALLET_UPDATE"]) {
    NSError *error;
    WalletUpdate *walletUpdate = [[WalletUpdate alloc] initWithData:event.data error:&error];
    if (error) {
      return;
    }
    switch (walletUpdate.type) {
      case WalletUpdate_Type_ThreadAdded:
        if ([self.delegate respondsToSelector:@selector(threadAdded:)]) {
          [self.delegate threadAdded:walletUpdate.id_p];
        }
        break;
      case WalletUpdate_Type_ThreadRemoved:
        if ([self.delegate respondsToSelector:@selector(threadRemoved:)]) {
          [self.delegate threadRemoved:walletUpdate.id_p];
        }
        break;
      case WalletUpdate_Type_AccountPeerAdded:
        if ([self.delegate respondsToSelector:@selector(accountPeerAdded:)]) {
          [self.delegate accountPeerAdded:walletUpdate.id_p];
        }
        break;
      case WalletUpdate_Type_AccountPeerRemoved:
        if ([self.delegate respondsToSelector:@selector(accountPeerRemoved:)]) {
          [self.delegate accountPeerRemoved:walletUpdate.id_p];
        }
        break;
      default:
        break;
    }
  } else if ([event.name isEqual: @"THREAD_UPDATE"]) {
    NSError *error;
    FeedItem *feedItem = [[FeedItem alloc] initWithData:event.data error:&error];
    if (!error && [self.delegate respondsToSelector:@selector(threadUpdateReceived:)]) {
      [self.delegate threadUpdateReceived:feedItem];
    }
  } else if ([event.name isEqual: @"NOTIFICATION"]) {
    NSError *error;
    Notification *notification = [[Notification alloc] initWithData:event.data error:&error];
    if (!error && [self.delegate respondsToSelector:@selector(notificationReceived:)]) {
      [self.delegate notificationReceived:notification];
    }
  } else if ([event.name isEqual: @"QUERY_RESPONSE"]) {
    NSError *error;
    MobileQueryEvent *queryEvent = [[MobileQueryEvent alloc] initWithData:event.data error:&error];
    if (error) {
      return;
    }
    switch (queryEvent.type) {
      case MobileQueryEvent_Type_Data: {
        NSString *type = queryEvent.data_p.value.typeURL;
        if ([type isEqualToString:@"/Thread"]) {
          NSError *error;
          Thread *thread = [[Thread alloc] initWithData:queryEvent.data_p.value.value error:&error];
          if (!error && [self.delegate respondsToSelector:@selector(clientThreadQueryResult:thread:)]) {
            [self.delegate clientThreadQueryResult:queryEvent.id_p thread:thread];
          }
        } else if ([type isEqualToString:@"/Contact"]) {
          NSError *error;
          Contact *contact = [[Contact alloc] initWithData:queryEvent.data_p.value.value error:&error];
          if (!error && [self.delegate respondsToSelector:@selector(contactQueryResult:contact:)]) {
            [self.delegate contactQueryResult:queryEvent.id_p contact:contact];
          }
        }
        break;
      }
      case MobileQueryEvent_Type_Done:
        if ([self.delegate respondsToSelector:@selector(queryDone:)]) {
          [self.delegate queryDone:queryEvent.id_p];
        }
        break;
      case MobileQueryEvent_Type_Error:
        if ([self.delegate respondsToSelector:@selector(queryError:error:)]) {
          Error *e = queryEvent.error;
          NSError *error = [NSError errorWithDomain:@"io.textile" code:e.code userInfo:@{ NSLocalizedDescriptionKey: e.message }];
          [self.delegate queryError:queryEvent.id_p error:error];
        }
        break;
      default:
        break;
    }
  }
}

@end
