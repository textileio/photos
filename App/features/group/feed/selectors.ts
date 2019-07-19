import { FeedItemData } from '@textile/react-native-sdk'

import { FeedState } from './reducer'

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
): ReadonlyArray<FeedItemData> {
  const feed = state.groups[groupId]
  if (!feed) {
    return []
  }
  return feed.items
}
