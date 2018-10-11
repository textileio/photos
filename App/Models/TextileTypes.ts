// BEGIN API Types

// private enums to enforce strict id types
// read here: https://basarat.gitbooks.io/typescript/docs/tips/nominalTyping.html#using-enums

import {IProcessingImageProps} from '../Components/ProcessingImage'

export const descriminators = {
  isTextileId: (object: any): object is TextileId => '_textileIdBrand' in object,
  isBlockId: (object: any): object is BlockId => '_blockIdBrand' in object,
  isThreadId: (object: any): object is ThreadId => ' _threadIdBrand' in object,
  isPhotoId: (object: any): object is PhotoId => '_photoIdBrand' in object,
  isPeerId: (object: any): object is PeerId => '_peerIdBrand' in object,
  isDeviceId: (object: any): object is DeviceId => '_deviceIdBrand' in object,
  isProfileAvatarId: (object: any): object is ProfileAvatarId => '_profileAvatarIdBrand' in object,
  isNotificationId: (object: any): object is NotificationId => '_notificationIdBrand' in object,
  isUserName: (object: any): object is UserName => '_userNameBrand' in object,
  isThreadName: (object: any): object is ThreadName => '_threadNameBrand' in object,
  isDeviceName: (object: any): object is DeviceName => '_deviceNameBrand' in object,
  isPublicKey: (object: any): object is PublicKey => '_publicKeyBrand' in object,
  isPrivateKey: (object: any): object is PrivateKey => '_privateKeyBrand' in object,
  isMnemonic: (object: any): object is Mnemonic => '_mnemonicBrand' in object,
  isSharedImage: (object: any): object is SharedImage => 'uri' in object && 'path' in object && 'canDelete' in object
}

export type TextileId = string & {
  _textileIdBrand: void
}
export interface BlockId extends String {
  _blockIdBrand: string
}
export interface ThreadId extends String {
  _threadIdBrand: string
}
export interface PhotoId extends String {
  _photoIdBrand: string
}
export interface PeerId extends String {
  _peerIdBrand: string
}
export interface DeviceId extends String {
  _deviceIdBrand: string
}
export interface ProfileAvatarId extends String {
  _profileAvatarIdBrand: string
}
export interface NotificationId extends String {
  _notificationIdBrand: string
}

export interface UserName extends String {
  _userNameBrand: string
}
export interface ThreadName extends String {
  _threadNameBrand: string
}
export interface DeviceName extends String {
  _deviceNameBrand: string
}
export interface PublicKey extends String {
  _publicKeyBrand: string
}
export interface PrivateKey extends String {
  _privateKeyBrand: string
}
export interface Mnemonic extends String {
  _mnemonicBrand: string
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
