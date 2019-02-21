import { pb } from '@textile/react-native-sdk'

import { FeedState } from './reducer'
import { FeedItem } from './models'

export function feedOffsetForGroup(state: FeedState, groupId: string) {
  const feed = state.groups[groupId]
  if (!feed || feed.items.length === 0) {
    return
  }
  const last = feed.items[feed.items.length - 1]
  return last.block
}

export const feedItems = (state: FeedState, groupId: string): ReadonlyArray<FeedItem> => {
  const feed = state.groups[groupId]
  if (!feed) {
    return []
  }
  const items = feed.items
    .map((feedItem) => {
      if (!feedItem.payload || typeof feedItem.payload.value === 'string') {
        return
      }
      let item: FeedItem | undefined
      switch (feedItem.payload.typeUrl) {
        // TODO: figure out what these typeUrls can be
        case 'ThreadFeedItemType.join': {
          item = {
            type: 'join',
            key: feedItem.block,
            data: pb.Join.deserializeBinary(feedItem.payload.value).toObject()
          }
          break
        }
        case 'ThreadFeedItemType.leave': {
          item = {
            type: 'leave',
            key: feedItem.block,
            data: pb.Leave.deserializeBinary(feedItem.payload.value).toObject()
          }
          break
        }
        case 'ThreadFeedItemType.files': {
          item = {
            type: 'photo',
            key: feedItem.block,
            data: pb.Files.deserializeBinary(feedItem.payload.value).toObject()
          }
          break
        }
        case 'ThreadFeedItemType.message': {
          item = {
            type: 'message',
            key: feedItem.block,
            data: pb.Text.deserializeBinary(feedItem.payload.value).toObject()
          }
          break
        }
      }
      return item
    })
    .reduce<FeedItem[]>((acc, val) => {
      if (val) {
        acc.push(val)
      }
      return acc
    }, [])
  return items
}
