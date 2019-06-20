import { FeedItemData } from '@textile/react-native-sdk'
import { AddingMessageItem } from './add-message/models'
import { AddingPhotoItem } from './add-photo/models'

export type Item = FeedItemData | AddingPhotoItem | AddingMessageItem
