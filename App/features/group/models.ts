import { FeedItem } from './feed/models'
import { AddingMessageItem } from './add-message/models'
import { AddingPhotoItem } from './add-photo/models'

export type Item = FeedItem | AddingPhotoItem | AddingMessageItem
