import { ICafeSession } from '@textile/react-native-sdk'

export interface Cafe {
  readonly peerId: string
  readonly token?: string // this is optional because we may not have tokens for previously registered custom cafes
  readonly error?: string
  readonly state: 'registering' | 'registered' | 'deregistering'
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
