export interface Event {
  name: string
  payload: string
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

export interface Notification {
  category: 'node' | 'devices' | 'threads' | 'content'
  type: string
  read: boolean
  timestamp: number
  unique?: boolean
  payload?: any
}

export interface Profile {
  id: string
  username?: string
  avatar_id?: string
}

export interface Photo {
  id: string
  date: string
  author_id: string
  caption: string
}

export interface Photos {
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
  format: string
  format_thumb: string
  width: number
  height: number
  latitude?: number
  longitude?: number
}

export interface ImageData {
  url: string
  metadata: PhotoMetadata
}

export type SharedImage = {
  origURL: string,
  uri: string,
  path?: string,
  height: number,
  width: number,
  isVertical: boolean,
  caption?: string, // used for pre-upload display
  addResult?: AddResult, // used to pickup uploads if restart
}

export type CafeTokens = {
  readonly access: string
  readonly refresh: string
}
