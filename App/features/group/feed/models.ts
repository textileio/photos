import { pb } from '@textile/react-native-sdk'

export interface Feed {
  readonly loading: boolean
  readonly items: ReadonlyArray<pb.FeedItem.AsObject>
  readonly error?: string
}

export interface Groups {
  readonly [key: string]: Feed | undefined
}

export interface JoinItem {
  readonly type: 'join'
  readonly key: string
  readonly data: pb.Join.AsObject
}

export interface LeaveItem {
  readonly type: 'leave'
  readonly key: string
  readonly data: pb.Leave.AsObject
}

export interface PhotoItem {
  readonly type: 'photo'
  readonly key: string
  readonly data: pb.Files.AsObject // TODO: this can be simplified to just the parts we need
}

export interface MessageItem {
  readonly type: 'message'
  readonly key: string
  readonly data: pb.Text.AsObject
}

export interface CommentsItem {
  readonly type: 'comments'
  readonly key: string
  readonly data: ReadonlyArray<pb.Comment.AsObject>
}

export interface LikesItem {
  readonly type: 'likes'
  readonly key: string
  readonly data: ReadonlyArray<pb.Like.AsObject>
}

export type FeedItem = JoinItem | LeaveItem | PhotoItem | MessageItem | CommentsItem | LikesItem
