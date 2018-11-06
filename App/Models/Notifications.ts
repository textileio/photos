import { NotificationType } from '../NativeModules/Textile'

interface BaseNotification {
  id: string
  date: string
  actor_id: string
  block_id?: string
  body: string
  read: boolean
}

export type ReceivedInviteNotification = BaseNotification & {
  threadName: string
  type: NotificationType.ReceivedInviteNotification
}

export type AccountPeerAddedNotification = BaseNotification & {
  type: NotificationType.AccountPeerAddedNotification
}

export type PeerJoinedNotification = BaseNotification & {
  threadId: string
  threadName: string
  type: NotificationType.PeerJoinedNotification
}

export type PeerLeftNotification = BaseNotification & {
  threadId: string
  threadName: string
  type: NotificationType.PeerLeftNotification
}

export type FileAddedNotification = BaseNotification & {
  threadId: string
  threadName: string
  hash: string
  type: NotificationType.FileAddedNotification
}

export type TextAddedNotification = BaseNotification & {
  threadId: string
  threadName: string
  type: NotificationType.TextAddedNotification
}

export type CommentAddedNotification = BaseNotification & {
  threadId: string
  threadName: string
  photoId: string
  type: NotificationType.CommentAddedNotification
}

export type LikeAddedNotification = BaseNotification & {
  threadId: string
  threadName: string
  photoId: string
  type: NotificationType.LikeAddedNotification
}

export type Notification =
  ReceivedInviteNotification |
  AccountPeerAddedNotification |
  PeerJoinedNotification |
  PeerLeftNotification |
  FileAddedNotification |
  TextAddedNotification |
  CommentAddedNotification |
  LikeAddedNotification
