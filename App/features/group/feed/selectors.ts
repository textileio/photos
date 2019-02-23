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
      switch (feedItem.payload.type_url) {
        // TODO: figure out what these typeUrls can be
        case '/Join': {
          item = {
            type: 'join',
            key: feedItem.block,
            data: pb.Join.decode(feedItem.payload.value)
          }
          break
        }
        case '/Leave': {
          item = {
            type: 'leave',
            key: feedItem.block,
            data: pb.Leave.decode(feedItem.payload.value)
          }
          break
        }
        case '/Files': {
          item = {
            type: 'photo',
            key: feedItem.block,
            data: pb.Files.decode(feedItem.payload.value)
          }
          break
        }
        case '/Text': {
          item = {
            type: 'message',
            key: feedItem.block,
            data: pb.Text.decode(feedItem.payload.value)
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
