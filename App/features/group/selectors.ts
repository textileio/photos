import { ThreadFeedItemType } from '@textile/react-native-sdk'

import { GroupState } from './reducer'
import {
  JoinItem,
  LeaveItem,
  PhotoItem,
  MessageItem,
  CommentsItem,
  LikesItem,
  AddingPhotoItem,
  AddingMessageItem,
  Item
} from './models'

export const feedItems = (state: GroupState, groupId: string) => {
  const feed = state.feed.groups[groupId]
  if (!feed) {
    return
  }
  const items = feed.items
    .map((feedItem) => {
      let item: Item | undefined
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
    .reduce<Item[]>((acc, val) => {
      if (val) {
        acc.push(val)
      }
      return acc
    }, [])
  return items
}
