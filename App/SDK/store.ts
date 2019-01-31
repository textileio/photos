import {AsyncStorage} from 'react-native'
import { StoredNodeState, TextileAppStateStatus } from './types'

export default class TextileStore {
  keys = {
    appState: '@textile/appState',
    profile: '@textile/profile',
    peerId: '@textile/peerId',
    sdkVersion: '@textile/sdkVersion',
    nodeOnline: '@textile/nodeOnline',
    nodeState: '@textile/nodeOnline'
  }
  clear = async () => {
    // clears only sdk related keys so that any client keys are untouched
    const storeKeys = Object.keys(this.keys).map((key) => this.keys[key])
    await AsyncStorage.multiRemove(storeKeys)
  }
  serialize = (data: any) => {
    return JSON.stringify(data)
  }
  getAppState = async (): Promise<TextileAppStateStatus | void> => {
    const result = await AsyncStorage.getItem(this.keys.appState)
    if (result) {
      return JSON.parse(result) as TextileAppStateStatus
    }
    return
  }
  getNodeOnline = async (): Promise<boolean | void> => {
    const result = await AsyncStorage.getItem(this.keys.nodeOnline)
    if (result) {
      return JSON.parse(result) as boolean
    }
    return
  }
  getNodeState = async (): Promise<StoredNodeState | void> => {
    const result = await AsyncStorage.getItem(this.keys.nodeState)
    if (result) {
      return JSON.parse(result) as StoredNodeState
    }
    return
  }
  setAppState = async (newState: TextileAppStateStatus): Promise<void> => {
    await AsyncStorage.setItem(this.keys.appState, this.serialize(newState))
  }
  setNodeOnline = async (online: boolean): Promise<void> => {
    await AsyncStorage.setItem(this.keys.nodeOnline, this.serialize(online))
  }
  setNodeState = async (item: StoredNodeState): Promise<void> => {
    await AsyncStorage.setItem(this.keys.nodeState, this.serialize(item))
  }
}
