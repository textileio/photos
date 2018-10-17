// BEGIN API Types

// private enums to enforce strict id types
// read here: https://basarat.gitbooks.io/typescript/docs/tips/nominalTyping.html#using-enums

import {IProcessingImageProps} from '../Components/ProcessingImage'

export type TextileId = string & { _textileIdBrand: void }
export type BlockId = string & { _blockIdBrand: void }
export type ThreadId = string & { _threadIdBrand: void }
export type PhotoId = string & { _photoIdBrand: void }
export type PeerId = string & { _peerIdBrand: void }
export type DeviceId = string & { _deviceIdBrand: void }
export type ProfileAvatarId = string & { _profileAvatarIdBrand: void }
export type NotificationId = string & { _notificationIdBrand: void }

export type UserName = string & { _userNameBrand: void }
export type ThreadName = string & { _threadNameBrand: void }
export type DeviceName = string & { _deviceNameBrand: void }
export type PublicKey = string & { _publicKeyBrand: void }
export type PrivateKey = string & { _privateKeyBrand: void }
export type Mnemonic = string & { _mnemonicBrand: void }

export enum NotificationType {
  receivedInviteNotification,
  deviceAddedNotification,
  photoAddedNotification,
  commentAddedNotification,
  likeAddedNotification,
  peerJoinedNotification,
  peerLeftNotification
}

export interface NotificationData {
  actor_id: PeerId
  actor_username: UserName
  block_id?: BlockId
  body: string
  data_id?: string
  date: string
  id: NotificationId
  read: boolean
  subject: string
  subject_id: string
  type: NotificationType
}

interface BaseNotification {
  actor_id: PeerId
  actor_username: UserName
  block_id?: BlockId
  body: string
  date: string
  id: NotificationId
  read: boolean
}

export type ReceivedInviteNotification = BaseNotification & {
  threadName: ThreadName
  type: NotificationType.receivedInviteNotification
}

export type DeviceAddedNotification = BaseNotification & {
  type: NotificationType.deviceAddedNotification
}

export type PhotoAddedNotification = BaseNotification & {
  threadId: ThreadId
  threadName: ThreadName
  photoId: PhotoId
  type: NotificationType.photoAddedNotification
}

export type CommentAddedNotification = BaseNotification & {
  threadId: ThreadId
  threadName: ThreadName
  photoId: PhotoId
  type: NotificationType.commentAddedNotification
}

export type LikeAddedNotification = BaseNotification & {
  threadId: ThreadId
  threadName: ThreadName
  photoId: PhotoId
  type: NotificationType.likeAddedNotification
}

export type PeerJoinedNotification = BaseNotification & {
  threadId: ThreadId
  threadName: ThreadName
  type: NotificationType.peerJoinedNotification
}

export type PeerLeftNotification = BaseNotification & {
  threadId: ThreadId
  threadName: ThreadName
  type: NotificationType.peerLeftNotification
}

export type Notification =
  ReceivedInviteNotification |
  DeviceAddedNotification |
  PhotoAddedNotification |
  CommentAddedNotification |
  LikeAddedNotification |
  PeerJoinedNotification |
  PeerLeftNotification

export interface GetNotificationsResult {
  items: NotificationData[]
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
  avatar_id?: ProfileAvatarId
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

export interface UserComment {
  id: BlockId
  date: string
  author_id: PeerId
  username?: UserName
  body: string
}

export interface UserLike {
  id: BlockId
  date: string
  author_id: PeerId
  username?: UserName
}

export interface GetPhotosResult {
  items: Photo[]
}

export interface Photo {
  id: PhotoId
  block_id: BlockId
  date: string
  author_id: PeerId
  caption?: string
  username?: string
  metadata?: PhotoMetadata
  comments: UserComment[]
  likes: UserLike[]
}

export interface ExternalInvite {
  id: BlockId,
  key: PrivateKey,
  inviter: UserName
}

export interface CafeTokens {
  readonly access: string
  readonly refresh: string
}

export interface NodeOverview {
  readonly swarm_size: number
  readonly device_count: number
  readonly thread_count: number
  readonly photo_count: number
  readonly contact_count: number
}

export interface IPhotoGridType {
  type: 'photo' | 'processingItem'
  photo: Photo | IProcessingImageProps
  id: PhotoId | string
}

export interface AddResult {
  id: PhotoId
  key: PrivateKey
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

export interface SharedImage {
  origURL?: string,
  uri: string,
  path: string,
  canDelete: boolean
}

export interface DeepLinkData {
  readonly href: string,
  readonly protocol: string,
  readonly host: string,
  readonly hostname: string,
  readonly port: string,
  readonly path: string,
  readonly search: string
  readonly hash: string
}

export interface ILocalPhotoResult {
  assetId: string,
  creationDate: string,
  modificationDate: string,
  orientation: number,
  path: string,
  uri: string,
  canDelete: boolean
}

export enum BlockType {
  InviteBlock = 0,
  ExternalInviteBlock = 1,
  JoinBlock = 2,
  LeaveBlock = 3,
  PhotoBlock = 4,
  CommentBlock = 5,
  LikeBlock,

  IgnoreBlock = 200,
  MergeBlock  = 201
}
export interface Block {
  type: BlockType
}

export interface Update {
  block: Block
  thread_id: ThreadId
  thread_name: ThreadName
}
