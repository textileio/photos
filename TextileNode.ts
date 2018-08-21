import {
  NativeModules,
  Platform,
  NativeEventEmitter,
  DeviceEventEmitter,
} from 'react-native'
import * as TextileTypes from './App/Models/TextileTypes'
import {Notification} from './App/Models/TextileTypes'

const { TextileNode, Events } = NativeModules

export default {
  create: async function (dataDir: string, apiUrl: string, logLevel: string, logFiles: boolean): Promise<void> {
    console.log(dataDir)
    return await TextileNode.create(dataDir, apiUrl, logLevel, logFiles)
  },

  mnemonic: async function (): Promise<string> {
    return await TextileNode.mnemonic()
  },

  start: async function (): Promise<void> {
    return await TextileNode.start()
  },

  stop: async function (): Promise<void> {
    return await TextileNode.stop()
  },

  signUpWithEmail: async function (email: string, username: string, password: string, referral: string): Promise<void> {
    return await TextileNode.signUpWithEmail(email, username, password, referral)
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

  setAvatarId: async function (id: string): Promise<void> {
    return await TextileNode.setAvatarId(id)
  },

  getProfile: async function (): Promise<TextileTypes.Profile> {
    const jsonString = await TextileNode.getProfile()
    const profile = JSON.parse(jsonString) as TextileTypes.Profile
    return profile
  },

  getPeerProfile: async function (id: string): Promise<TextileTypes.Profile> {
    const jsonString = await TextileNode.getPeerProfile(id)
    const profile = JSON.parse(jsonString) as TextileTypes.Profile
    return profile
  },

  getPublicKey: async function (): Promise<string> {
    return await TextileNode.getPubKey()
  },

  getId: async function (): Promise<string> {
    return await TextileNode.getId()
  },

  getUsername: async function (): Promise<string> {
    return await TextileNode.getUsername()
  },

  getTokens: async function (): Promise<TextileTypes.CafeTokens> {
    const jsonString = await TextileNode.getTokens()
    const tokens = JSON.parse(jsonString) as TextileTypes.CafeTokens
    return tokens
  },

  getOverview: async function (): Promise<TextileTypes.NodeOverview> {
    const jsonString = await TextileNode.getOverview()
    const tokens = JSON.parse(jsonString) as TextileTypes.NodeOverview
    return tokens
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

  getPhotos: async function (limit: number, threadId: string, offset: string = ''): Promise<TextileTypes.Photo[]> {
    const jsonString = await TextileNode.getPhotos(offset, limit, threadId)
    const result = JSON.parse(jsonString) as TextileTypes.GetPhotosResult
    return result.items
  },

  getPhotoData: async function (id: string, path: string): Promise<TextileTypes.ImageData> {
    const jsonString = await TextileNode.getPhotoData(id, path)
    const imageData = JSON.parse(jsonString) as TextileTypes.ImageData
    return imageData
  },

  getPhotoThreads: async function (id: string): Promise<Array<string>> {
    const jsonString = await TextileNode.getPhotoThreads(id)
    const threads = JSON.parse(jsonString) as Array<string>
    return threads
  },

  getPhotoKey: async function (id: string): Promise<string> {
    const key = await TextileNode.getPhotoKey(id)
    return key
  },

  ignorePhoto: async function (blockId: string): Promise<string> {
    const key = await TextileNode.ignorePhoto(blockId)
    return key
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

  getNotifications: async function (limit: number, offset: string = ''): Promise<TextileTypes.GetNotificationsResult> {
    const jsonString = await TextileNode.getNotifications(offset, limit)
    return JSON.parse(jsonString) as TextileTypes.GetNotificationsResult
  },

  countUnreadNotifications: async function (): Promise<number> {
    return await TextileNode.countUnreadNotifications()
  },

  readNotification: async function (id: string): Promise<void> {
    return await TextileNode.readNotification(id)
  },

  readAllNotification: async function (): Promise<void> {
    return await TextileNode.readAllNotification()
  },

  eventEmitter: Platform.select({
    ios: new NativeEventEmitter(Events),
    android: DeviceEventEmitter,
  })
}
