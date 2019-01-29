import {AsyncStorage} from 'react-native'
import { ContactInfo, CafeSession } from '@textile/react-native-sdk'

export interface ErrorType {
  error?: Error
}
export default class Store {
  serialize = (data: any) => {
    return JSON.stringify(data)
  }
  setAccountProfile = async (profile: ContactInfo): Promise<void | ErrorType> => {
    try {
      await AsyncStorage.setItem('@textile/profile', this.serialize(profile))
    } catch (error) {
      // Error retrieving data
      return {error}
    }
  }
  setPeerId = async (peerId: string): Promise<void | ErrorType> => {
    try {
      await AsyncStorage.setItem('@textile/peerId', peerId)
    } catch (error) {
      // Error retrieving data
      return {error}
    }
  }
  getAccountProfile = async (): Promise<{result: ContactInfo} | ErrorType> => {
    try {
      const result = await AsyncStorage.getItem('@textile/profile')
      if (result) {
        return {result: JSON.parse(result) as ContactInfo}
      }
    } catch (error) {
      // Error retrieving data
      return {error}
    }
    return {error: new Error('unknown')}
  }
  getPeerId = async (): Promise<{result: string} | ErrorType> => {
    try {
      const result = await AsyncStorage.getItem('@textile/peerId')
      if (result) {
        return {result}
      }
    } catch (error) {
      // Error retrieving data
      return {error}
    }
    return {error: new Error('unknown')}
  }
}
