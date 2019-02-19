import { ThreadFeedItemType } from '@textile/react-native-sdk'

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
      let item: FeedItem | undefined
      switch (feedItem.type) {
        case ThreadFeedItemType.join: {
          item = {
            type: 'join',
            key: feedItem.block,
            data: feedItem.join!
          }
          break
        }
        case ThreadFeedItemType.leave: {
          item = {
            type: 'leave',
            key: feedItem.block,
            data: feedItem.leave!
          }
          break
        }
        case ThreadFeedItemType.files: {
          item = {
            type: 'photo',
            key: feedItem.block,
            data: feedItem.files!
          }
          break
        }
        case ThreadFeedItemType.message: {
          item = {
            type: 'message',
            key: feedItem.block,
            data: feedItem.message!
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
