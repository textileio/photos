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
  create: async function (dataDir: string, apiUrl: string, logLevel: string, logFiles: boolean): Promise<void> {
    console.log(dataDir)
    return await TextileNode.create(dataDir, apiUrl, logLevel, logFiles)
  },

  start: async function (): Promise<void> {
    return await TextileNode.start()
  },

  stop: async function (): Promise<void> {
    return await TextileNode.stop()
  },

  signUpWithEmail: async function (username: string, password: string, email: string, referral: string): Promise<void> {
    return await TextileNode.signUpWithEmail(username, password, email, referral)
  },

  signIn: async function (username: string, password: string): Promise<void> {
    return await TextileNode.signIn(username, password)
  },

  signOut: async function (): Promise<void> {
    return await TextileNode.signOut()
  },

  isSignedIn: async function (): Promise<boolean> {
    return await TextileNode.isSignedIn()
  },

  getId: async function (): Promise<string> {
    return await TextileNode.getId()
  },

  getIPFSPeerId: async function (): Promise<string> {
    return await TextileNode.getIPFSPeerId()
  },

  getUsername: async function (): Promise<string> {
    return await TextileNode.getUsername()
  },

  getAccessToken: async function (): Promise<string> {
    return await TextileNode.getAccessToken()
  },

  addThread: async function (name: string, mnemonic: string): Promise<void> {
    return await TextileNode.addThread(name, mnemonic)
  },

  addPhoto: async function (path: string, threadName: string, caption: string): Promise<MultipartData> {
    return await TextileNode.addPhoto(path, threadName, caption)
  },

  sharePhoto: async function (id: string, threadName: string, caption: string): Promise<string> {
    return await TextileNode.sharePhoto(id, threadName, caption)
  },

  getPhotoBlocks: async function (offset: ?string, limit: number, threadName: string): Promise<[any]> {
    return await TextileNode.getPhotoBlocks(offset || '', limit, threadName)
  },

  getBlockData: async function (id: string, path: string): Promise<string> {
    return await TextileNode.getBlockData(id, path)
  },

  getFileData: async function (id: string, path: string): Promise<string> {
    return await TextileNode.getFileData(id, path)
  },

  pairDevice: async function (pubKey: string): Promise<string> {
    return await TextileNode.pairDevice(pubKey)
  },

  getFilePath: async function (uri: string): Promise<string> {
    return await TextileNode.getFilePath(uri)
  },

  eventEmitter: Platform.select({
    ios: new NativeEventEmitter(Events),
    android: DeviceEventEmitter,
  })
}
