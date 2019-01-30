import { AppStateStatus } from 'react-native'
import { NodeState } from '../Models/TextileTypes'
export interface DiscoveredCafe {
  readonly peer: string
  readonly address: string
  readonly api: string
  readonly protocol: string
  readonly node: string
  readonly url: string
}
export interface DiscoveredCafes {
  readonly primary: DiscoveredCafe
  readonly secondary: DiscoveredCafe
}

export interface TextileOptions {
  debug?: boolean
}
export interface StoredNodeState {
  state: NodeState
  error?: string
}
export type TextileAppStateStatus = AppStateStatus | 'unknown' | 'backgroundFromForeground'
