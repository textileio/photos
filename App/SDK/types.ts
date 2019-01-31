import { AppStateStatus } from 'react-native'

export enum NodeState {
  'nonexistent' = 'nonexistent',
  'creating' = 'creating',
  'created' = 'created', // Node has been created, on it's way to starting
  'starting' = 'starting',
  'started' = 'started',
  'stopping' = 'stopping',
  'stopped' = 'stopped', // Node has been explicitly stopped, different than created
  'creatingWallet' = 'creatingWallet',
  'derivingAccount' = 'derivingAccount',
  'initializingRepo' = 'initializingRepo'
}

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
