import {
  ThreadJoinInfo,
  ThreadLeaveInfo,
  ThreadFilesInfo,
  ThreadMessageInfo,
  ThreadCommentInfo,
  ThreadLikeInfo,
  ThreadFeedItem
} from '@textile/react-native-sdk'

export interface Feed {
  readonly loading: boolean
  readonly items: ReadonlyArray<ThreadFeedItem>
  readonly error?: string
}

export interface Groups {
  readonly [key: string]: Feed | undefined
}

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

export interface MessageItem {
  readonly type: 'message'
  readonly key: string
  readonly data: ThreadMessageInfo
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

export type FeedItem = JoinItem | LeaveItem | PhotoItem | MessageItem | CommentsItem | LikesItem
