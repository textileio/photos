// @flow
import {
  NativeModules,
  Platform,
  NativeEventEmitter,
  DeviceEventEmitter,
} from 'react-native'
import { Buffer } from 'buffer'

const { TextileNode, Events } = NativeModules

type MultipartData = {
  payloadPath: string,
  boundary: string
}

type LocalhostHeader = {
  Authorization: string
}

type HashRequest = {
  uri: string,
  headers: LocalhostHeader
}

export default {
  createNodeWithDataDir: async function (dataDir: string, apiUrl: string, logLevel: string, logFiles: boolean): boolean {
    console.log(dataDir)
    const success = await TextileNode.createNodeWithDataDir(dataDir, apiUrl, logLevel, logFiles)
    return success
  },

  startNode: async function (): boolean {
    const success = await TextileNode.startNode()
    return success
  },

  stopNode: async function (): boolean {
    const success = await TextileNode.stopNode()
    return success
  },

  signIn: async function (username: string, password: string): string {
    const result = await TextileNode.signIn(username, password)
    return result
  },

  signUp: async function (username: string, password: string, email: string, referral: string): string {
    const result = await TextileNode.signUpWithEmail(username, password, email, referral)
    return result
  },

  isSignedIn: function (): boolean {
    const result = TextileNode.isSignedIn()
    return result
  },

  signOut: async function () {
    await TextileNode.signOut()
  },

  getUsername: async function (): string {
    const result = await TextileNode.getUsername()
    return result
  },

  updateThread: async function (mnemonic: string, name: string): boolean {
    const success = await TextileNode.updateThread(mnemonic, name)
    return success
  },

  addImageAtPath: async function (path: string, thumbPath: string, thread: string): MultipartData {
    const multipartData = await TextileNode.addImageAtPath(path, thumbPath, thread)
    return multipartData
  },

  sharePhoto: async function (hash: string, thread: string, caption: string): MultipartData {
    const multipartData = await TextileNode.sharePhoto(hash, thread, caption)
    return multipartData
  },

  getPhotos: async function (offset: ?string, limit: number, thread: string): string {
    const result = await TextileNode.getPhotos(offset || '', limit, thread)
    return result
  },

  getHashData: async function (hash: string, path: string): string {
    const result = await TextileNode.getHashData(hash + path)
    return result
  },

  getHashRequest: async function (hash: string, path: string): HashRequest {
    const result = await TextileNode.getHashRequest(hash + path)
    const encoded = Buffer.from(':' + result.token).toString('base64')
    return {
      uri: result.protocol + '://' + result.host + '/ipfs/' + hash + path,
      headers: {
        Authorization: 'Basic ' + encoded
      }
    }
  },

  pairNewDevice: async function (pubKey: string): string {
    const result = await TextileNode.pairNewDevice(pubKey)
    return result
  },

  getFilePath: async function (uri: string): string {
    const result = await TextileNode.getRealPathFromURI(uri)
    return result
  },

  getAccessToken: async function (): string {
    const result = await TextileNode.getAccessToken()
    return result
  },

  eventEmitter: Platform.select({
    ios: new NativeEventEmitter(Events),
    android: DeviceEventEmitter,
  })
}
