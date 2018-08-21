export interface Event {
  name: string
  payload: string
}

export enum NotificationType {
  receivedInviteNotification,
  deviceAddedNotification,
  photoAddedNotification,
  commentAddedNotification,
  likeAddedNotification,
  peerJoinedNotification,
  peerLeftNotification
}

export interface GetNotificationsResult {
  items: Notification[]
}

export interface Notification {
  actor_id: string
  actor_username: string
  body: string
  category: string
  date: string
  id: string
  read: boolean
  target_id: string
  type: NotificationType
}

export interface NotificationEngagement {
  alert: string,
  badge: number,
  foreground: boolean,
  message: string,
  sound: string,
  userInteraction: boolean,
  data?: any,
  finish?: Function
}

export interface Thread {
  id: string
  name: string
  peers: number
}

export interface Threads  {
  items: Thread[]
}

export interface Device {
  id: string
  name: string
}

export interface Devices {
  items: Device[]
}

export interface Profile {
  id: string
  username?: string
  avatar_id?: string
}

export interface Photo {
  id: string
  block_id: string
  date: string
  author_id: string
  caption: string
  metadata: PhotoMetadata
}

export interface GetPhotosResult {
  items: Photo[]
}

export interface ExternalInvite {
  id: string,
  key: string,
  inviter: string
}

export interface AddResult {
  id: string
  key: string
  archive?: FileArchive
}

export interface FileArchive {
  id: string
  path: string
}

export interface Metadata {
  username?: string
  created?: string
  added?: string
}

export interface FileMetadata extends Metadata {
  name?: string
  extension?: string
}

export interface PhotoMetadata extends FileMetadata {
  version: string,
  created: string,
  added: string,
  name: string,
  extension: string,
  width: number,
  height: number,
  original_format: string,
  encoding_format: string
}

export interface ImageData {
  url: string
  metadata: PhotoMetadata
}

export type SharedImage = {
  origURL?: string,
  uri: string,
  path: string,
  canDelete: boolean,
  height: number,
  width: number,
  isVertical: boolean
}

export type CafeTokens = {
  readonly access: string
  readonly refresh: string
}

export type NodeOverview = {
  readonly swarm_size: number
  readonly device_count: number
  readonly thread_count: number
  readonly photo_count: number
  readonly contact_count: number
}
