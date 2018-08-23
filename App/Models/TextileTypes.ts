// BEGIN API Types

export type TextileId = string
export type BlockId = TextileId
export type ThreadId = TextileId
export type PhotoId = TextileId
export type PeerId = TextileId
export type DeviceId = TextileId
export type AvatarId = TextileId
export type NotificationId = TextileId
export type UserName = string
export type ThreadName = string
export type DeviceName = string
export type PublicKey = string
export type PrivateKey = string

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

export interface Notification {
  actor_id: PeerId
  actor_username: UserName
  block_id?: BlockId
  body: string
  data_id?: TextileId
  date: string
  id: NotificationId
  read: boolean
  subject: string
  subject_id: TextileId
  type: NotificationType
}

export interface GetNotificationsResult {
  items: Notification[]
}

export interface Thread {
  id: ThreadId
  name: ThreadName
  peers: number
}

export interface Threads  {
  items: Thread[]
}

export interface Contact {
  id: PeerId
  pk: PublicKey
  thread_ids: string[]
  username?: string // <- Added by RN, perhaps replace with an embedded Profile
}

export interface Profile {
  id: PeerId
  username?: UserName
  avatar_id?: AvatarId
}

export interface GetContactsResult {
  items: Contact[]
}

export interface Devices {
  items: Device[]
}

export interface Device {
  id: DeviceId
  name: DeviceName
}

export interface GetPhotosResult {
  items: Photo[]
}

export interface Photo {
  id: PhotoId
  block_id: BlockId
  date: string
  author_id: string
  caption?: string
  metadata: PhotoMetadata
}

export interface ExternalInvite {
  id: string,
  key: string,
  inviter: string
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

export interface AddResult {
  id: string
  key: string
  archive?: FileArchive
}

export interface FileArchive {
  path: string
}

export interface Metadata {
  username?: UserName
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

export type DeepLinkData = {
  readonly href: string,
  readonly protocol: string,
  readonly host: string,
  readonly hostname: string,
  readonly port: string,
  readonly path: string,
  readonly search: string
  readonly hash: string
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
