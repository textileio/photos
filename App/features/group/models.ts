import { FeedItemData, ICafeSyncGroupStatus } from '@textile/react-native-sdk'
import { AddingMessageItem } from './add-message/models'
import { AddingPhotoItem } from './add-photo/models'
import { GroupStatus } from './file-sync/models'

export type SyncingFeedItemData = FeedItemData & {
  syncStatus?: GroupStatus
}

export type Item = SyncingFeedItemData | AddingPhotoItem | AddingMessageItem
