import { ICafeSession } from '@textile/react-native-sdk'

import cafesJson from '../../Config/env/cafes.json'

export interface Cafe {
  readonly url: string
  readonly peerId: string
  readonly name?: string // added by local Config but not node
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

export const cafes: Array<{
  name: string
  url: string
  peerId: string
  token: string
}> = cafesJson
