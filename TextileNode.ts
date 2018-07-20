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
    const thread = JSON.parse(jsonString) as TextileTypes.Thread
    return thread
  },

  removeThread: async function (threadId: string): Promise<string> {
    return await TextileNode.removeThread(threadId)
  },

  threads: async function (): Promise<TextileTypes.Threads> {
    const jsonString = await TextileNode.threads()
    const threads = JSON.parse(jsonString) as TextileTypes.Threads
    return threads
  },

  addExternalThreadInvite: async function (id: string): Promise<TextileTypes.ExternalInvite> {
    const jsonString = await TextileNode.addExternalThreadInvite(id)
    const externalInvite = JSON.parse(jsonString) as TextileTypes.ExternalInvite
    return externalInvite
  },

  acceptExternalThreadInvite: async function (inviteId: string, key: string): Promise<string> {
    return await TextileNode.acceptExternalThreadInvite(inviteId, key)
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
    return await TextileNode.sharePhotoToThread(dataId, threadId, caption)
  },

  getPhotos: async function (limit: number, threadId: string, offset: string = ''): Promise<TextileTypes.Photos> {
    const jsonString = await TextileNode.getPhotos(offset, limit, threadId)
    const photos = JSON.parse(jsonString) as TextileTypes.Photos
    return photos
  },

  getPhotoData: async function (id: string): Promise<TextileTypes.ImageData> {
    const jsonString = await TextileNode.getPhotoData(id)
    const imageData = JSON.parse(jsonString) as TextileTypes.ImageData
    return imageData
  },

  getThumbData: async function (id: string): Promise<TextileTypes.ImageData> {
    const jsonString = await TextileNode.getThumbData(id)
    const imageData = JSON.parse(jsonString) as TextileTypes.ImageData
    return imageData
  },

  getPhotoMetadata: async function (id: string): Promise<TextileTypes.PhotoMetadata> {
    const jsonString = await TextileNode.getPhotoMetadata(id)
    const photoMetadata = JSON.parse(jsonString) as TextileTypes.PhotoMetadata
    return photoMetadata
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

  refreshMessages: async function (): Promise<void> {
    return await TextileNode.refreshMessages()
  },

  eventEmitter: Platform.select({
    ios: new NativeEventEmitter(Events),
    android: DeviceEventEmitter,
  })
}
