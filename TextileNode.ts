import {
  NativeModules,
  Platform,
  NativeEventEmitter,
  DeviceEventEmitter,
} from 'react-native'
import * as TT from './App/Models/TextileTypes'

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

  signUpWithEmail: async function (email: string, username: TT.UserName, password: string, referral: string): Promise<void> {
    return await TextileNode.signUpWithEmail(email, username, password, referral)
  },

  signIn: async function (username: TT.UserName, password: string): Promise<void> {
    return await TextileNode.signIn(username, password)
  },

  signOut: async function (): Promise<void> {
    return await TextileNode.signOut()
  },

  isSignedIn: async function (): Promise<boolean> {
    return await TextileNode.isSignedIn()
  },

  setAvatarId: async function (id: TT.PhotoId): Promise<void> {
    return await TextileNode.setAvatarId(id)
  },

  getProfile: async function (): Promise<TT.Profile> {
    const jsonString = await TextileNode.getProfile()
    const profile = JSON.parse(jsonString) as TT.Profile
    return profile
  },

  getPeerProfile: async function (id: TT.PeerId): Promise<TT.Profile> {
    const jsonString = await TextileNode.getPeerProfile(id)
    const profile = JSON.parse(jsonString) as TT.Profile
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

  getTokens: async function (): Promise<TT.CafeTokens> {
    const jsonString = await TextileNode.getTokens()
    const tokens = JSON.parse(jsonString) as TT.CafeTokens
    return tokens
  },

  getOverview: async function (): Promise<TT.NodeOverview> {
    const jsonString = await TextileNode.getOverview()
    const tokens = JSON.parse(jsonString) as TT.NodeOverview
    return tokens
  },

  addThread: async function (name: TT.ThreadName, mnemonic?: string): Promise<TT.Thread> {
    const jsonString = await TextileNode.addThread(name, mnemonic)
    const thread = JSON.parse(jsonString) as TT.Thread
    return thread
  },

  removeThread: async function (threadId: TT.ThreadId): Promise<string> {
    return await TextileNode.removeThread(threadId)
  },

  threads: async function (): Promise<TT.Threads> {
    const jsonString = await TextileNode.threads()
    const threads = JSON.parse(jsonString) as TT.Threads
    return threads
  },

  addThreadInvite: async function (threadId: TT.ThreadId, inviteePk: TT.PublicKey): Promise<string> {
    const jsonString = await TextileNode.addThreadInvite(threadId, inviteePk)
    // const thread = JSON.parse(jsonString) as TextileTypes.Thread
    return jsonString
  },

  addExternalThreadInvite: async function (id: TT.ThreadId): Promise<TT.ExternalInvite> {
    const jsonString = await TextileNode.addExternalThreadInvite(id)
    const externalInvite = JSON.parse(jsonString) as TT.ExternalInvite
    return externalInvite
  },

  acceptExternalThreadInvite: async function (inviteId: TT.BlockId, key: TT.PrivateKey): Promise<string> {
    return await TextileNode.acceptExternalThreadInvite(inviteId, key)
  },

  addPhoto: async function (path: string): Promise<TT.AddResult> {
    const jsonString = await TextileNode.addPhoto(path)
    const addResult = JSON.parse(jsonString) as TT.AddResult
    return addResult
  },

  addPhotoToThread: async function (dataId: TT.PhotoId, key: TT.PrivateKey, threadId: TT.ThreadId, caption?: string): Promise<string> {
    return await TextileNode.addPhotoToThread(dataId, key, threadId, caption)
  },

  sharePhotoToThread: async function (dataId: TT.PhotoId, threadId: TT.ThreadId, caption?: string): Promise<string> {
    return await TextileNode.sharePhotoToThread(dataId, threadId, caption)
  },

  getPhotos: async function (limit: number, threadId: TT.ThreadId, offset: string = ''): Promise<TT.Photo[]> {
    const jsonString = await TextileNode.getPhotos(offset, limit, threadId)
    const result = JSON.parse(jsonString) as TT.GetPhotosResult
    return result.items
  },

  getPhotoData: async function (id: TT.PhotoId, path: string): Promise<TT.ImageData> {
    const jsonString = await TextileNode.getPhotoData(id, path)
    const imageData = JSON.parse(jsonString) as TT.ImageData
    return imageData
  },

  getPhotoThreads: async function (id: TT.PhotoId): Promise<Array<string>> {
    const jsonString = await TextileNode.getPhotoThreads(id)
    const threads = JSON.parse(jsonString) as Array<string>
    return threads
  },

  getPhotoKey: async function (id: TT.PhotoId): Promise<string> {
    const key = await TextileNode.getPhotoKey(id)
    return key
  },

  ignorePhoto: async function (blockId: TT.BlockId): Promise<string> {
    const key = await TextileNode.ignorePhoto(blockId)
    return key
  },

  addDevice: async function (name: TT.DeviceName, pubKey: TT.PublicKey): Promise<void> {
    return await TextileNode.addDevice(name, pubKey)
  },

  removeDevice: async function (id: TT.DeviceId): Promise<void> {
    return await TextileNode.removeDevice(id)
  },

  devices: async function (): Promise<TT.Devices> {
    const jsonString = await TextileNode.devices()
    const devices = JSON.parse(jsonString) as TT.Devices
    return devices
  },

  getFilePath: async function (uri: string): Promise<string> {
    return await TextileNode.getFilePath(uri)
  },

  refreshMessages: async function (): Promise<void> {
    return await TextileNode.refreshMessages()
  },

  getNotifications: async function (limit: number, offset: string = ''): Promise<TT.GetNotificationsResult> {
    const jsonString = await TextileNode.getNotifications(offset, limit)
    return JSON.parse(jsonString) as TT.GetNotificationsResult
  },

  countUnreadNotifications: async function (): Promise<number> {
    return await TextileNode.countUnreadNotifications()
  },

  readNotification: async function (id: TT.NotificationId): Promise<void> {
    return await TextileNode.readNotification(id)
  },

  readAllNotification: async function (): Promise<void> {
    return await TextileNode.readAllNotification()
  },

  acceptThreadInviteViaNotification: async function (id: TT.NotificationId): Promise<TT.BlockId> {
    return await TextileNode.acceptThreadInviteViaNotification(id)
  },

  getContacts: async function (): Promise<TT.GetContactsResult> {
    const jsonString = await TextileNode.getContacts()
    return JSON.parse(jsonString) as TT.GetContactsResult
  },

  eventEmitter: Platform.select({
    ios: new NativeEventEmitter(Events),
    android: DeviceEventEmitter,
  })
}
