import { ICafeSession } from '@textile/react-native-sdk'

export interface Cafe {
  readonly url: string
  readonly peerId: string
  readonly name?: string // future enhancement
  readonly description?: string // future enhancement
  readonly token?: string // this is optional because we may not have tokens for previously registered custom cafes
  readonly error?: string
  readonly state: 'registering' | 'registered' | 'deregistering' | 'available'
}

export interface Cafes {
  readonly [peerId: string]: Cafe
}

export interface CafeSessionData {
  readonly session: ICafeSession
  readonly processing: boolean
  readonly error?: string
}

export interface CafeSessionsData {
  readonly [peerId: string]: CafeSessionData
}

export interface CafeAPI {
  name?: string
  description?: string
  url?: string
  peer?: string
  address?: string
  api?: string
  protocol?: string
  node?: string
}
