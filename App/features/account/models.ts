import { ICafeSession } from '@textile/react-native-sdk'

export interface CafeSessionData {
  readonly session?: ICafeSession
  readonly processing: boolean
  readonly error?: string
}

export interface CafeSessionsData {
  readonly [peerId: string]: CafeSessionData | undefined
}
