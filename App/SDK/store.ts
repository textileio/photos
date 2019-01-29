import {AsyncStorage} from 'react-native'
import { ContactInfo, CafeSession } from '@textile/react-native-sdk'

export default class TextileStore {
  keys = {
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
}
