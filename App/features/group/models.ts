import { FeedItemData, ICafeSyncGroupStatus } from '@textile/react-native-sdk'
import { AddingMessageItem } from './add-message/models'
import { AddingPhotoItem } from './add-photo/models'

export type Item =
  | (FeedItemData & { syncStatus?: ICafeSyncGroupStatus })
  | AddingPhotoItem
  | AddingMessageItem
