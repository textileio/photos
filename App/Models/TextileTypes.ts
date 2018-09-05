// BEGIN API Types

// private enums to enforce strict id types
// read here: https://basarat.gitbooks.io/typescript/docs/tips/nominalTyping.html#using-enums
enum TextileIdBase {}
enum BlockIdBase {}
enum ThreadIdBase {}
enum PhotoIdBase {}
enum PeerIdBase {}
enum DeviceIdBase {}
enum ProfileAvatarIdBase {}
enum NotificationIdBase {}
export type TextileId = TextileIdBase & string & undefined
export type BlockId = BlockIdBase & string & undefined
export type ThreadId = ThreadIdBase & string & undefined
export type PhotoId = PhotoIdBase & string & undefined
export type PeerId = PeerIdBase & string & undefined
export type DeviceId = DeviceIdBase & string & undefined
export type ProfileAvatarId = ProfileAvatarIdBase & string & undefined
export type NotificationId = NotificationIdBase & string & undefined

enum UserNameBase {}
enum ThreadNameBase {}
enum DeviceNameBase {}
enum PublicKeyBase {}
enum PrivateKeyBase {}
enum MnemonicBase {}
export type UserName = UserNameBase & string & undefined
export type ThreadName = ThreadNameBase & string & undefined
export type DeviceName = DeviceNameBase & string & undefined
export type PublicKey = PublicKeyBase & string & undefined
export type PrivateKey = PrivateKeyBase & string & undefined
export type Mnemonic = MnemonicBase & string & undefined

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
  Likes: UserLike[]
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
  canDelete: boolean,
  height: number,
  width: number,
  isVertical: boolean
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

export interface NotificationEngagement {
  alert: string,
  badge: number,
  foreground: boolean,
  message: string,
  sound: string,
  userInteraction: boolean,
  data?: any,
  finish?: () => void
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
