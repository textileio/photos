import { NotificationType } from '../NativeModules/Textile'

interface BaseNotification {
  actor_id: string
  actor_username: string
  block_id?: string
  body: string
  date: string
  id: string
  read: boolean
}

export type ReceivedInviteNotification = BaseNotification & {
  threadName: string
  type: NotificationType.ReceivedInviteNotification
}

export type DeviceAddedNotification = BaseNotification & {
  type: NotificationType.DeviceAddedNotification
}

export type PhotoAddedNotification = BaseNotification & {
  threadId: string
  threadName: string
  photoId: string
  type: NotificationType.PhotoAddedNotification
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

// TODO: Look into what these properties should be
export type TextAddedNotification = BaseNotification & {
  threadId: string
  threadName: string
  type: NotificationType.TextAddedNotification
}

export type Notification =
  ReceivedInviteNotification |
  DeviceAddedNotification |
  PhotoAddedNotification |
  CommentAddedNotification |
  LikeAddedNotification |
  PeerJoinedNotification |
  PeerLeftNotification |
  TextAddedNotification
