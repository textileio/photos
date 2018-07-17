import {
  NativeModules,
  Platform,
  NativeEventEmitter,
  DeviceEventEmitter,
} from 'react-native'
import * as TextileTypes from './App/Models/TextileTypes'

const { TextileNode, Events } = NativeModules

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

  getUsername: async function (): Promise<string> {
    return await TextileNode.getUsername()
  },

  getAccessToken: async function (): Promise<string> {
    return await TextileNode.getAccessToken()
  },

  addThread: async function (name: string, mnemonic?: string): Promise<TextileTypes.ThreadItem> {
    const jsonString = await TextileNode.addThread(name, mnemonic)
    const threadItem = JSON.parse(jsonString) as TextileTypes.ThreadItem
    return threadItem
  },

  removeThread: async function (threadId: string): Promise<void> {
    return await TextileNode.removeThread(threadId)
  },

  threads: async function (): Promise<TextileTypes.Threads> {
    const jsonString = await TextileNode.threads()
    const threads = JSON.parse(jsonString) as TextileTypes.Threads
    return threads
  },

  addExternalThreadInvite: async function (name: string, pubKey: string): Promise<string> {
    return await TextileNode.addExternalThreadInvite(name, pubKey)
  },

  acceptExternalThreadInvite: async function (threadId: string, key:string): Promise<void> {
    return await TextileNode.acceptExternalThreadInvite(threadId, key)
  },

  addPhoto: async function (path: string, threadName: string, caption?: string): Promise<TextileTypes.PinRequests> {
    const jsonString = await TextileNode.addPhoto(path, threadName, caption)
    const pinRequests = JSON.parse(jsonString) as TextileTypes.PinRequests
    return pinRequests
  },

  sharePhoto: async function (id: string, threadName: string, caption?: string): Promise<TextileTypes.PinRequests> {
    const jsonString = await TextileNode.sharePhoto(id, threadName, caption)
    const pinRequests = JSON.parse(jsonString) as TextileTypes.PinRequests
    return pinRequests
  },

  getPhotoBlocks: async function (limit: number, threadName: string, offset: string = ''): Promise<TextileTypes.Blocks> {
    const jsonString = await TextileNode.getPhotoBlocks(offset, limit, threadName)
    const blocks = JSON.parse(jsonString) as TextileTypes.Blocks
    return blocks
  },

  getBlockData: async function (id: string, path: string): Promise<string> {
    return await TextileNode.getBlockData(id, path)
  },

  getFileData: async function (id: string, path: string): Promise<string> {
    return await TextileNode.getFileData(id, path)
  },

  addDevice: async function (name: string, pubKey: string): Promise<void> {
    return await TextileNode.addDevice(name, pubKey)
  },

  removeDevice: async function (id: string): Promise<void> {
    return await TextileNode.removeDevice(id)
  },

  devices: async function (): Promise<string> {
    return await TextileNode.devices()
  },

  getFilePath: async function (uri: string): Promise<string> {
    return await TextileNode.getFilePath(uri)
  },

  eventEmitter: Platform.select({
    ios: new NativeEventEmitter(Events),
    android: DeviceEventEmitter,
  })
}
