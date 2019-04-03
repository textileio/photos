import { pb } from '@textile/react-native-sdk'

interface BaseNotification {
  id: string
  date: Date
  actor: string
  block: string
  body: string
  read: boolean
  username: string
  avatar: string
}

export type InviteReceivedNotification = BaseNotification & {
  threadName: string
  type: pb.Notification.Type.INVITE_RECEIVED
}

export type AccountPeerJoinedNotification = BaseNotification & {
  type: pb.Notification.Type.ACCOUNT_PEER_JOINED
}

export type PeerJoinedNotification = BaseNotification & {
  threadId: string
  threadName: string
  type: pb.Notification.Type.PEER_JOINED
}

export type PeerLeftNotification = BaseNotification & {
  threadId: string
  threadName: string
  type: pb.Notification.Type.PEER_LEFT
}

export type MessageAddedNotification = BaseNotification & {
  threadId: string
  threadName: string
  target: string
  type: pb.Notification.Type.MESSAGE_ADDED
}

export type FilesAddedNotification = BaseNotification & {
  threadId: string
  threadName: string
  target: string
  type: pb.Notification.Type.FILES_ADDED
}

export type CommentAddedNotification = BaseNotification & {
  threadId: string
  threadName: string
  target: string
  type: pb.Notification.Type.COMMENT_ADDED
}

export type LikeAddedNotification = BaseNotification & {
  threadId: string
  threadName: string
  target: string
  type: pb.Notification.Type.LIKE_ADDED
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
