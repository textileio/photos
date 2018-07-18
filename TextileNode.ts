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

  addThread: async function (name: string, mnemonic?: string): Promise<TextileTypes.Thread> {
    const jsonString = await TextileNode.addThread(name, mnemonic)
    const threadItem = JSON.parse(jsonString) as TextileTypes.Thread
    return threadItem
  },

  removeThread: async function (threadId: string): Promise<string> {
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

  acceptExternalThreadInvite: async function (threadId: string, key: string): Promise<string> {
    return await TextileNode.acceptExternalThreadInvite(threadId, key)
  },

  addPhoto: async function (path: string): Promise<TextileTypes.AddResult> {
    const jsonString = await TextileNode.addPhoto(path)
    const addResult = JSON.parse(jsonString) as TextileTypes.AddResult
    return addResult
  },

  addPhotoToThread: async function (dataId: string, key: string, threadId: string, caption?: string): Promise<string> {
    return await TextileNode.addPhotoToThread(dataId, key, threadId, caption)
  },

  sharePhotoToThread: async function (dataId: string, threadId: string, caption?: string): Promise<string> {
    return await TextileNode.sharePhoto(dataId, threadId, caption)
  },

  getPhotos: async function (limit: number, threadId: string, offset: string = ''): Promise<TextileTypes.Photos> {
    const jsonString = await TextileNode.getPhotos(offset, limit, threadId)
    const photos = JSON.parse(jsonString) as TextileTypes.Photos
    return photos
  },

  getPhotoData: async function (id: string): Promise<string> {
    return await TextileNode.getPhotoData(id)
  },

  getThumbData: async function (id: string): Promise<string> {
    return await TextileNode.getThumbData(id)
  },

  getPhotoMetadata: async function (id: string): Promise<string> {
    return await TextileNode.getPhotoMetadata(id)
  },

  addDevice: async function (name: string, pubKey: string): Promise<void> {
    return await TextileNode.addDevice(name, pubKey)
  },

  removeDevice: async function (id: string): Promise<void> {
    return await TextileNode.removeDevice(id)
  },

  devices: async function (): Promise<TextileTypes.Devices> {
    const jsonString = await TextileNode.devices()
    const devices = JSON.parse(jsonString) as TextileTypes.Devices
    return devices
  },

  getFilePath: async function (uri: string): Promise<string> {
    return await TextileNode.getFilePath(uri)
  },

  eventEmitter: Platform.select({
    ios: new NativeEventEmitter(Events),
    android: DeviceEventEmitter,
  })
}
