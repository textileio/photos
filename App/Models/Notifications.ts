import { NotificationType } from '@textile/react-native-sdk'

interface BaseNotification {
  id: string
  date: string
  actor_id: string
  block_id?: string
  body: string
  read: boolean
  username?: string
  avatar?: string
}

export type InviteReceivedNotification = BaseNotification & {
  threadName: string
  type: NotificationType.InviteReceivedNotification
}

export type AccountPeerJoinedNotification = BaseNotification & {
  type: NotificationType.AccountPeerJoinedNotification
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

export type MessageAddedNotification = BaseNotification & {
  threadId: string
  threadName: string
  target: string
  type: NotificationType.MessageAddedNotification
}

export type FilesAddedNotification = BaseNotification & {
  threadId: string
  threadName: string
  target: string
  type: NotificationType.FilesAddedNotification
}

export type CommentAddedNotification = BaseNotification & {
  threadId: string
  threadName: string
  target: string
  type: NotificationType.CommentAddedNotification
}

export type LikeAddedNotification = BaseNotification & {
  threadId: string
  threadName: string
  target: string
  type: NotificationType.LikeAddedNotification
}

export type Notification =
  InviteReceivedNotification |
  AccountPeerJoinedNotification |
  PeerJoinedNotification |
  PeerLeftNotification |
  MessageAddedNotification |
  FilesAddedNotification |
  CommentAddedNotification |
  LikeAddedNotification
