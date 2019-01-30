import {AsyncStorage} from 'react-native'
import { ContactInfo, CafeSession } from '@textile/react-native-sdk'
import { TextileAppStateStatus } from '../Redux/TextileNodeRedux'

export default class TextileStore {
  keys = {
    appState: '@textile/appState',
    profile: '@textile/profile',
    peerId: '@textile/peerId',
    sdkVersion: '@textile/sdkVersion'
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
}
