// BEGIN API Types

// private enums to enforce strict id types
// read here: https://basarat.gitbooks.io/typescript/docs/tips/nominalTyping.html#using-enums

import {IProcessingImageProps} from '../Components/ProcessingImage'

export interface TextileId extends String { _textileIdBrand: void }
export interface BlockId extends String { _blockIdBrand: void }
export interface ThreadId extends String { _threadIdBrand: void }
export interface PhotoId extends String { _photoIdBrand: void }
export interface PeerId extends String { _peerIdBrand: void }
export interface DeviceId extends String { _deviceIdBrand: void }
export interface ProfileAvatarId extends String { _profileAvatarIdBrand: void }
export interface NotificationId extends String { _notificationIdBrand: void }

export interface UserName extends String { _userNameBrand: void }
export interface ThreadName extends String { _threadNameBrand: void }
export interface DeviceName extends String { _deviceNameBrand: void }
export interface PublicKey extends String { _publicKeyBrand: void }
export interface PrivateKey extends String { _privateKeyBrand: void }
export interface Mnemonic extends String { _mnemonicBrand: void }

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
  actor_id: string
  actor_username: string
  block_id?: string
  body: string
  data_id?: string
  date: string
  id: string
  read: boolean
  subject: string
  subject_id: string
  type: NotificationType
}

export abstract class Notification {
  actor_id: PeerId
  actor_username: UserName
  block_id?: BlockId
  body: string
  date: string
  id: NotificationId
  read: boolean

  constructor(notificationData: NotificationData) {
    this.actor_id = notificationData.actor_id as any
    this.actor_username = notificationData.actor_username as any
    this.block_id = notificationData.block_id as any
    this.body = notificationData.body
    this.date = notificationData.date
    this.id = notificationData.id as any
    this.read = notificationData.read
  }
}

export class ReceivedInviteNotification extends Notification {
  threadName: ThreadName

  constructor(notificationData: NotificationData) {
    super(notificationData)
    this.threadName = notificationData.subject as any
  }
}

export class DeviceAddedNotification extends Notification {
}

export class PhotoAddedNotification extends Notification {
  threadId: ThreadId
  threadName: ThreadName
  photoId: PhotoId

  constructor(notificationData: NotificationData) {
    super(notificationData)
    this.threadId = notificationData.subject_id as any
    this.threadName = notificationData.subject as any
    this.photoId = notificationData.data_id as any
  }
}

export class CommentAddedNotification extends Notification {
  threadId: ThreadId
  threadName: ThreadName
  photoId: PhotoId

  constructor(notificationData: NotificationData) {
    super(notificationData)
    this.threadId = notificationData.subject_id as any
    this.threadName = notificationData.subject as any
    this.photoId = notificationData.data_id as any
  }
}

export class LikeAddedNotification extends Notification {
  threadId: ThreadId
  threadName: ThreadName
  photoId: PhotoId

  constructor(notificationData: NotificationData) {
    super(notificationData)
    this.threadId = notificationData.subject_id as any
    this.threadName = notificationData.subject as any
    this.photoId = notificationData.data_id as any
  }
}

export class PeerJoinedNotification extends Notification {
  threadId: ThreadId
  threadName: ThreadName

  constructor(notificationData: NotificationData) {
    super(notificationData)
    this.threadId = notificationData.subject_id as any
    this.threadName = notificationData.subject as any
  }
}

export class PeerLeftNotification extends Notification {
  threadId: ThreadId
  threadName: ThreadName

  constructor(notificationData: NotificationData) {
    super(notificationData)
    this.threadId = notificationData.subject_id as any
    this.threadName = notificationData.subject as any
  }
}

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
