import {
  ThreadJoinInfo,
  ThreadLeaveInfo,
  ThreadFilesInfo,
  ThreadMessageInfo,
  ThreadCommentInfo,
  ThreadLikeInfo
} from '@textile/react-native-sdk'

import { Message } from './add-message/models'

export interface JoinItem {
  readonly type: 'join'
  readonly key: string
  readonly data: ThreadJoinInfo
}

export interface LeaveItem {
  readonly type: 'leave'
  readonly key: string
  readonly data: ThreadLeaveInfo
}

export interface PhotoItem {
  readonly type: 'photo'
  readonly key: string
  readonly data: ThreadFilesInfo // TODO: this can be simplified to just the parts we need
}

export interface AddingPhotoItem {
  readonly type: 'addingPhoto'
  readonly key: string
  readonly data: any // TODO: move this from ProcessingImagesRedux
}

export interface MessageItem {
  readonly type: 'message'
  readonly key: string
  readonly data: ThreadMessageInfo
}

export interface AddingMessageItem {
  readonly type: 'addingMessage'
  readonly key: string
  readonly data: Message
}

export interface CommentsItem {
  readonly type: 'comments'
  readonly key: string
  readonly data: ReadonlyArray<ThreadCommentInfo>
}

export interface LikesItem {
  readonly type: 'likes'
  readonly key: string
  readonly data: ReadonlyArray<ThreadLikeInfo>
}

export type Item = JoinItem | LeaveItem | PhotoItem | AddingPhotoItem | MessageItem | AddingMessageItem | CommentsItem | LikesItem
