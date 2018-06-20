// @flow
import {
  NativeModules,
  Platform,
  NativeEventEmitter,
  DeviceEventEmitter,
} from 'react-native'

const { TextileNode, Events } = NativeModules

type MultipartData = {
  payloadPath: string,
  boundary: string
}

export default {
  create: async function (dataDir: string, apiUrl: string, logLevel: string, logFiles: boolean): boolean {
    console.log(dataDir)
    return await TextileNode.create(dataDir, apiUrl, logLevel, logFiles)
  },

  start: async function (): boolean {
    return await TextileNode.start()
  },

  stop: async function (): boolean {
    return await TextileNode.stop()
  },

  signUpWithEmail: async function (username: string, password: string, email: string, referral: string): string {
    return await TextileNode.signUpWithEmail(username, password, email, referral)
  },

  signIn: async function (username: string, password: string): string {
    return await TextileNode.signIn(username, password)
  },

  signOut: async function (): string {
    return await TextileNode.signOut()
  },

  isSignedIn: function (): boolean {
    return TextileNode.isSignedIn()
  },

  getId: async function (): string {
    return await TextileNode.getId()
  },

  getIPFSPeerId: async function (): string {
    return await TextileNode.getIPFSPeerId()
  },

  getUsername: async function (): string {
    return await TextileNode.getUsername()
  },

  getAccessToken: async function (): string {
    return await TextileNode.getAccessToken()
  },

  addThread: async function (name: string, mnemonic: string): MultipartData {
    return await TextileNode.addThread(name, mnemonic)
  },

  addPhoto: async function (path: string, threadName: string, caption: string): MultipartData {
    return await TextileNode.addPhoto(path, threadName, caption)
  },

  sharePhoto: async function (id: string, threadName: string, caption: string): string {
    return await TextileNode.sharePhoto(id, threadName, caption)
  },

  getPhotoBlocks: async function (offset: ?string, limit: number, threadName: string): string {
    return await TextileNode.getPhotoBlocks(offset || '', limit, threadName)
  },

  getBlockData: async function (id: string, path: string): string {
    return await TextileNode.getBlockData(id, path)
  },

  getFileData: async function (id: string, path: string): string {
    return await TextileNode.getFileData(id, path)
  },

  pairDevice: async function (pubKey: string): string {
    return await TextileNode.pairDevice(pubKey)
  },

  getFilePath: async function (uri: string): string {
    return await TextileNode.getFilePath(uri)
  },

  eventEmitter: Platform.select({
    ios: new NativeEventEmitter(Events),
    android: DeviceEventEmitter,
  })
}
