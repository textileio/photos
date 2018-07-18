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

export interface Photo {
  id: string
  date: string
  author_id: string
  catption: string
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
  pin_request: PinRequest
}

export interface PinRequest {
  Boundary: string
  PayloadPath: string
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
