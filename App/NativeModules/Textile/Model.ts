// export type BlockId = string & { _blockIdBrand: void }

export interface ExternalInvite {
  readonly id: string
  readonly key: string
  readonly inviter: string
}

export interface Archive {
  readonly path: string
}

export interface AddDataResult {
  readonly id: string
  readonly key: string
  readonly archive?: Archive
}

export interface Thread {
  readonly id: string
  readonly name: string
  readonly peers: number
}

export interface Threads {
  readonly items: ReadonlyArray<Thread>
}

export interface CafeSession {
  readonly cafe_id: string
  readonly access: string
  readonly refresh: string
  readonly expiry: string
  readonly http_addr: string
}

export interface CafeSessions {
  readonly items: ReadonlyArray<CafeSession>
}

export interface Contact {
  readonly id: string
  readonly username: string
  readonly thread_ids: ReadonlyArray<string>
  readonly added: string
}

export interface Contacts {
  readonly items: ReadonlyArray<Contact>
}

export enum NotificationType {
  ReceivedInviteNotification,
  AccountPeerAddedNotification,
  PeerJoinedNotification,
  PeerLeftNotification,
  FileAddedNotification,
  TextAddedNotification,
  CommentAddedNotification,
  LikeAddedNotification
}

export interface Notification {
  readonly id: string
  readonly date: string
  readonly actor_id: string
  readonly subject: string
  readonly subject_id: string
  readonly block_id?: string
  readonly data_id?: string
  readonly type: NotificationType
  readonly body: string
  readonly read: boolean
}

export interface Notifications {
  readonly items: ReadonlyArray<Notification>
}

export interface Overview {
  readonly swarm_size: number
  readonly account_peer_count: number
  readonly thread_count: number
  readonly photo_count: number
  readonly contact_count: number
}

export interface Profile {
  readonly address: string
  readonly inboxes: ReadonlyArray<string>
  readonly username?: string
  readonly avatar_uri?: string
}

export interface ImageData {
  readonly url: string
}

export interface Metadata {
  readonly version: string
  readonly created?: string
  readonly added: string
  readonly name: string
  readonly ext: string
  readonly width: number
  readonly height: number
  readonly original_format: string
  readonly encoding_format: string
  readonly latitude?: number
  readonly longitude?: number
}

export interface Annotation {
  readonly id: string
  readonly date: string
  readonly author_id: string
  readonly username?: string
}

export interface Comment {
  readonly Annotation: Annotation // TODO: no json name mapping in textile-go
  readonly body: string
}

export interface Like {
  readonly Annotation: Annotation // TODO: no json name mapping in textile-go
}

export interface Photo {
  readonly id: string
  readonly block_id: string
  readonly date: string
  readonly author_id: string
  readonly caption?: string
  readonly username?: string
  readonly metadata?: Metadata
  readonly comments: ReadonlyArray<Comment>
  readonly likes: ReadonlyArray<Like>
}

export interface Photos {
  readonly items: ReadonlyArray<Photo>
}

export enum BlockType {
  MergeBlock,
  IgnoreBlock,
  JoinBlock,
  AnnounceBlock,
  LeaveBlock,
  PhotoBlock,
  CommentBlock,
  LikeBlock
}

export interface Block {
  readonly id: string
  readonly date: string
  readonly parents: ReadonlyArray<string>
  readonly thread_id: string
  readonly author_id: string
  readonly type: BlockType
  readonly data_id?: string
  // readonly data_key?: byte[] // TODO: what type should this be?
  readonly data_caption?: string
  readonly data_metadata?: Metadata
}

export interface ThreadInfo {
  readonly id: string
  readonly name: string
  readonly head?: Block
  readonly peer_cnt: number
  readonly block_cnt: number
  readonly file_cnt: number
}

export interface WalletAccount {
  readonly Seed: string // TODO: no json name mappings for these in textile-go
  readonly Address: string
}

export interface ThreadUpdate {
  block: Block
  thread_id: string
  thread_name: string
}

export enum UpdateType {
  ThreadAdded,
  ThreadRemoved,
  AccountPeerAdded,
  AccountPeerRemoved
}

export interface Update {
  id: string
  name: string
  type: UpdateType
}
