import { ICafeSession } from '@textile/react-native-sdk'
import Config from 'react-native-config'
import { Buffer } from 'buffer'

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

const cafesBase64 = Config.RN_TEXTILE_CAFES_JSON
const cafesString = new Buffer(cafesBase64, 'base64').toString()
export const cafes: Array<{
  url: string
  name: string
  peerId: string
  token: string
}> = JSON.parse(cafesString)
