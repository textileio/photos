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
    const storeKeys = Object.keys(this.keys).map((key) => this.keys[key])
    await AsyncStorage.multiRemove(storeKeys)
  }
  serialize = (data: any) => {
    return JSON.stringify(data)
  }
  getSDKVersion = async (): Promise<string | void> => {
    const result = await AsyncStorage.getItem(this.keys.sdkVersion)
    if (result) {
      return result
    }
    return
  }
  setSDKVersion = async (version: string): Promise<void> => {
    await AsyncStorage.setItem(this.keys.sdkVersion, version)
  }
  setAppState = async (newState: TextileAppStateStatus): Promise<void> => {
    await AsyncStorage.setItem(this.keys.appState, this.serialize(newState))
  }
  getAppState = async (): Promise<string | void> => {
    const result = await AsyncStorage.getItem(this.keys.appState)
    if (result) {
      return result
    }
    return
  }
  setNodeOnline = async (online: boolean): Promise<void> => {
    await AsyncStorage.setItem(this.keys.nodeOnline, this.serialize(online))
  }
  getNodeOnline = async (): Promise<boolean> => {
    const result = await AsyncStorage.getItem(this.keys.nodeOnline)
    if (result) {
      return JSON.parse(result) as boolean
    }
    return false
  }

  setNodeState = async (item: StoredNodeState): Promise<void> => {
    await AsyncStorage.setItem(this.keys.nodeState, this.serialize(item))
  }
  getNodeState = async (): Promise<StoredNodeState | void> => {
    const result = await AsyncStorage.getItem(this.keys.nodeState)
    if (result) {
      return JSON.parse(result) as StoredNodeState
    }
    return
  }
}
