import { pb } from '@textile/react-native-sdk'

export interface Feed {
  readonly loading: boolean
  readonly items: ReadonlyArray<pb.IFeedItem>
  readonly error?: string
}

export interface Groups {
  readonly [key: string]: Feed | undefined
}

export interface JoinItem {
  readonly type: 'join'
  readonly key: string
  readonly data: pb.IJoin
}

export interface LeaveItem {
  readonly type: 'leave'
  readonly key: string
  readonly data: pb.ILeave
}

export interface PhotoItem {
  readonly type: 'photo'
  readonly key: string
  readonly data: pb.IFiles // TODO: this can be simplified to just the parts we need
}

export interface MessageItem {
  readonly type: 'message'
  readonly key: string
  readonly data: pb.IText
}

export interface CommentsItem {
  readonly type: 'comments'
  readonly key: string
  readonly data: ReadonlyArray<pb.IComment>
}

export interface LikesItem {
  readonly type: 'likes'
  readonly key: string
  readonly data: ReadonlyArray<pb.ILike>
}

export type FeedItem = JoinItem | LeaveItem | PhotoItem | MessageItem | CommentsItem | LikesItem
