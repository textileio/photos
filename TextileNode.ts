import {
  NativeModules,
  Platform,
  NativeEventEmitter,
  DeviceEventEmitter,
} from 'react-native'
import { Threads } from './App/Redux/ThreadsRedux'

const { TextileNode, Events } = NativeModules

type UserData = {
  id: String,
  userName: String
}

type PinRequest = {
  boundary: string,
  payloadPath: string,
}

type PinRequests = {
  items: PinRequest[]
}

type ThreadItem = {
  id: string,
  name: string,
  peers: number
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

  getUsername: async function (): Promise<string> {
    return await TextileNode.getUsername()
  },

  getAccessToken: async function (): Promise<string> {
    return await TextileNode.getAccessToken()
  },

  addThread: async function (name: string, mnemonic?: string): Promise<ThreadItem> {
    const jsonString = await TextileNode.addThread(name, mnemonic)
    const jsonObject = JSON.parse(jsonString)
    return jsonObject
  },

  removeThread: async function (id: string): Promise<void> {
    return await TextileNode.removeThread(id)
  },

  threads: async function (): Promise<Threads> {
    const jsonString = await TextileNode.threads()
    const threads = JSON.parse(jsonString) as Threads
    return threads
  },

  addPhoto: async function (path: string, threadName: string, caption: string): Promise<PinRequests> {
    const jsonString = await TextileNode.addPhoto(path, threadName, caption)
    const jsonObject = JSON.parse(jsonString)
    return jsonObject.items
  },

  sharePhoto: async function (id: string, threadName: string, caption: string): Promise<PinRequests> {
    const jsonString = TextileNode.sharePhoto(id, threadName, caption)
    const jsonObject = JSON.parse(jsonString)
    return jsonObject.items
  },

  getPhotoBlocks: async function (limit: number, threadName: string, offset: string = ''): Promise<any[]> {
    const jsonString = await TextileNode.getPhotoBlocks(offset, limit, threadName)
    const jsonObject = JSON.parse(jsonString)
    return jsonObject.items
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
