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
#import "util.h"

@implementation Messenger

- (void)notify: (MobileEvent *)event {
  switch (event.type) {
    case MobileEventType_NodeStart: {
      if ([self.delegate respondsToSelector:@selector(nodeStarted)]) {
        [self.delegate nodeStarted];
      }
      break;
    }
    case MobileEventType_NodeStop: {
      if ([self.delegate respondsToSelector:@selector(nodeStopped)]) {
        [self.delegate nodeStopped];
      }
      break;
    }
    case MobileEventType_NodeOnline: {
      if ([self.delegate respondsToSelector:@selector(nodeOnline)]) {
        [self.delegate nodeOnline];
      }
      break;
    }
    case MobileEventType_AccountUpdate: {
      NSError *error;
      AccountUpdate *accountUpdate = [[AccountUpdate alloc] initWithData:event.data error:&error];
      if (error) {
        return;
      }
      switch (accountUpdate.type) {
        case AccountUpdate_Type_ThreadAdded:
          if ([self.delegate respondsToSelector:@selector(threadAdded:)]) {
            [self.delegate threadAdded:accountUpdate.id_p];
          }
          break;
        case AccountUpdate_Type_ThreadRemoved:
          if ([self.delegate respondsToSelector:@selector(threadRemoved:)]) {
            [self.delegate threadRemoved:accountUpdate.id_p];
          }
          break;
        case AccountUpdate_Type_AccountPeerAdded:
          if ([self.delegate respondsToSelector:@selector(accountPeerAdded:)]) {
            [self.delegate accountPeerAdded:accountUpdate.id_p];
          }
          break;
        case AccountUpdate_Type_AccountPeerRemoved:
          if ([self.delegate respondsToSelector:@selector(accountPeerRemoved:)]) {
            [self.delegate accountPeerRemoved:accountUpdate.id_p];
          }
          break;
        default:
          break;
      }
      break;
    }
    case MobileEventType_ThreadUpdate: {
      NSError *error;
      FeedItem *feedItem = [[FeedItem alloc] initWithData:event.data error:&error];
      FeedItemData *data = feedItemData(feedItem);
      if (!error && data && [self.delegate respondsToSelector:@selector(threadUpdateReceived:data:)]) {
        [self.delegate threadUpdateReceived:feedItem.thread data:data];
      }
      break;
    }
    case MobileEventType_Notification: {
      NSError *error;
      Notification *notification = [[Notification alloc] initWithData:event.data error:&error];
      if (!error && [self.delegate respondsToSelector:@selector(notificationReceived:)]) {
        [self.delegate notificationReceived:notification];
      }
      break;
    }
    case MobileEventType_QueryResponse: {
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
      break;
    }
    case MobileEventType_CafeSyncGroupUpdate: {
      NSError *error;
      CafeSyncGroupStatus *syncGroupStatus = [[CafeSyncGroupStatus alloc] initWithData:event.data error:&error];
      if (error) {
        return;
      }
      if ([self.delegate respondsToSelector:@selector(syncUpdate:)]) {
        [self.delegate syncUpdate:syncGroupStatus];
      }
      break;
    }
    case MobileEventType_CafeSyncGroupComplete: {
      NSError *error;
      CafeSyncGroupStatus *syncGroupStatus = [[CafeSyncGroupStatus alloc] initWithData:event.data error:&error];
      if (error) {
        return;
      }
      if ([self.delegate respondsToSelector:@selector(syncComplete:)]) {
        [self.delegate syncComplete:syncGroupStatus];
      }
      break;
    }
    case MobileEventType_CafeSyncGroupFailed: {
      NSError *error;
      CafeSyncGroupStatus *syncGroupStatus = [[CafeSyncGroupStatus alloc] initWithData:event.data error:&error];
      if (error) {
        return;
      }
      if ([self.delegate respondsToSelector:@selector(syncFailed:)]) {
        [self.delegate syncFailed:syncGroupStatus];
      }
      break;
    }
    default:
      break;
  }
}

@end
