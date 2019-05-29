import { Join, Leave, Files, Text } from '@textile/react-native-sdk'

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

export function feedItems(
  state: FeedState,
  groupId: string
): ReadonlyArray<FeedItem> {
  const feed = state.groups[groupId]
  if (!feed) {
    return []
  }
  const items = feed.items
    .map(feedItem => {
      let item: FeedItem | undefined
      if (!feedItem.payload || typeof feedItem.payload.value === 'string') {
        return item // bail
      }
      switch (feedItem.payload.type_url) {
        // TODO: figure out what these typeUrls can be
        case '/Join': {
          item = {
            type: 'join',
            key: feedItem.block,
            data: Join.decode(feedItem.payload.value)
          }
          break
        }
        case '/Leave': {
          item = {
            type: 'leave',
            key: feedItem.block,
            data: Leave.decode(feedItem.payload.value)
          }
          break
        }
        case '/Files': {
          item = {
            type: 'photo',
            key: feedItem.block,
            data: Files.decode(feedItem.payload.value)
          }
          break
        }
        case '/Text': {
          item = {
            type: 'message',
            key: feedItem.block,
            data: Text.decode(feedItem.payload.value)
          }
          break
        }
        default:
          throw new Error(
            'Unexpected payload type_url:' + feedItem.payload.type_url
          )
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
