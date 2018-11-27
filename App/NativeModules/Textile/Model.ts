// export type BlockId = string & { _blockIdBrand: void }

export interface File {
  readonly mill: string
  readonly checksum: string
  readonly source: string
  readonly opts?: string
  readonly hash: string
  readonly key?: string
  readonly media: string
  readonly name?: string
  readonly size: number
  readonly added: string
  readonly meta?: ReadonlyMap<string, any>
  readonly targets?: ReadonlyArray<string>
}

export interface Directory {
  readonly [key: string]: File
}

export interface ThreadFileInfo {
  readonly index: number
  readonly file?: File
  readonly links?: Directory
}

export interface ThreadCommentInfo {
  readonly id: string
  readonly date: string
  readonly author_id: string
  readonly username?: string
  readonly body: string
}

export interface ThreadLikeInfo {
  readonly id: string
  readonly date: string
  readonly author_id: string
  readonly username?: string
}

export interface ThreadFilesInfo {
  readonly block: string
  readonly target: string
  readonly date: string
  readonly author_id: string
  readonly username?: string
  readonly caption?: string
  readonly files: ReadonlyArray<ThreadFileInfo>
  readonly comments: ReadonlyArray<ThreadCommentInfo>
  readonly likes: ReadonlyArray<ThreadLikeInfo>
  readonly threads: ReadonlyArray<string>
}

export interface BlockInfo {
  readonly id: string
  readonly thread_id: string
  readonly author_id: string
  readonly username: string
  readonly type: string // TODO: No more enum?
  readonly date: string
  readonly parents: ReadonlyArray<string>
  readonly target?: string
  readonly body?: string
}

export interface ExternalInvite {
  readonly id: string
  readonly key: string
  readonly inviter: string
}

export interface CafeSession {
  readonly cafe_id: string
  readonly access: string
  readonly refresh: string
  readonly expiry: string
  readonly http_addr: string
  readonly swarm_addrs: ReadonlyArray<string>
}

export interface Contact {
  readonly id: string
  readonly username: string
  readonly thread_ids: ReadonlyArray<string>
  readonly added: string
}

export enum NotificationType {
  InviteReceivedNotification,
  AccountPeerAddedNotification,
  PeerJoinedNotification,
  PeerLeftNotification,
  MessageAddedNotification,
  FilesAddedNotification,
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
  readonly target?: string
  readonly type: NotificationType
  readonly body: string
  readonly read: boolean
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
  readonly inboxes?: ReadonlyArray<string>
  readonly username?: string
  readonly avatar_uri?: string
}

export interface FileData {
  readonly url: string
}

export interface Link {
  readonly use?: string
  readonly pin: boolean
  readonly plaintext: boolean
  readonly mill?: string
  readonly opts?: { readonly [key: string]: string }
  readonly json_schema?: { readonly [key: string]: any }
}

export interface Node {
  readonly name?: string
  readonly pin: boolean
  readonly plaintext: boolean
  readonly mill?: string
  readonly opts?: { readonly [key: string]: string }
  readonly json_schema?: { readonly [key: string]: any }
  readonly links?: { readonly [key: string]: Link }
}

// TODO: Use these if we get enums on ThreadInfo
export enum ThreadType {
  PrivateThread,
  ReadOnlyThread,
  PublicThread,
  OpenThread
}

export enum ThreadState {
  ThreadLoading,
  ThreadLoaded
}

export interface ThreadInfo {
  readonly id: string
  readonly key: string
  readonly name: string
  readonly schema?: Node
  readonly schem_id?: string
  readonly initiator: string
  readonly type: string // TODO: no enum?
  readonly state: string // TODO: no enum?
  readonly head?: BlockInfo
  readonly peer_cnt: number
  readonly block_cnt: number
  readonly file_cnt: number
}

export interface WalletAccount {
  readonly Seed: string // TODO: no json name mappings for these in textile-go
  readonly Address: string
}

export interface ThreadUpdate {
  block: BlockInfo
  thread_id: string
  thread_name: string
  info?: { [key: string]: any } // interface{} is this correct?
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
