import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform
} from 'react-native'
import * as TT from '../Models/TextileTypes'

const { TextileNode, Events } = NativeModules

export default {
  async requestLocalPhotos (minEpoch: number): Promise<void> {
    await TextileNode.requestLocalPhotos(Math.round(minEpoch / 1000))
  },

  async create (dataDir: string, apiUrl: string, logLevel: string, logFiles: boolean): Promise<void> {
    // console.log(dataDir)
    return await TextileNode.create(dataDir, apiUrl, logLevel, logFiles)
  },

  async mnemonic (): Promise<TT.Mnemonic> {
    return await TextileNode.mnemonic()
  },

  async start (): Promise<void> {
    return await TextileNode.start()
  },

  async stop (): Promise<void> {
    return await TextileNode.stop()
  },

  async signUpWithEmail (email: string, username: TT.UserName, password: string, referral: string): Promise<void> {
    return await TextileNode.signUpWithEmail(email, username, password, referral)
  },

  async signIn (username: TT.UserName, password: string): Promise<void> {
    return await TextileNode.signIn(username, password)
  },

  async signOut (): Promise<void> {
    return await TextileNode.signOut()
  },

  async isSignedIn (): Promise<boolean> {
    return await TextileNode.isSignedIn()
  },

  async setAvatarId (id: TT.PhotoId): Promise<void> {
    return await TextileNode.setAvatarId(id)
  },

  async getProfile (): Promise<TT.Profile> {
    const jsonString = await TextileNode.getProfile()
    const profile = JSON.parse(jsonString) as TT.Profile
    return profile
  },

  async getPeerProfile (id: TT.PeerId): Promise<TT.Profile> {
    const jsonString = await TextileNode.getPeerProfile(id)
    const profile = JSON.parse(jsonString) as TT.Profile
    return profile
  },

  async getPublicKey (): Promise<TT.PublicKey> {
    return await TextileNode.getPubKey()
  },

  async getId (): Promise<TT.PeerId> {
    return await TextileNode.getId()
  },

  /**
   * Get the current user's Username
   * Go will return an empty string, gobind doesn't support nil
   * @returns {Promise<UserName | undefined>}
   */
  async getUsername (): Promise<TT.UserName | undefined> {
    const username = await TextileNode.getUsername()
    if (username === '') {
      return undefined
    }
    return  username
  },

  /**
   * Get the current Cafe tokens
   * Go will return an empty string, gobind doesn't support nil
   * @returns {Promise<CafeTokens | undefined>}
   */
  async getTokens (force: boolean = false): Promise<TT.CafeTokens | undefined> {
    const jsonString = await TextileNode.getTokens(force)
    if (jsonString === '') {
      return undefined
    }
    return JSON.parse(jsonString) as TT.CafeTokens
  },

  async getOverview (): Promise<TT.NodeOverview> {
    const jsonString = await TextileNode.getOverview()
    const overview = JSON.parse(jsonString) as TT.NodeOverview
    return overview
  },

  async addThread (name: string): Promise<TT.Thread> {
    const jsonString = await TextileNode.addThread(name)
    const thread = JSON.parse(jsonString) as TT.Thread
    return thread
  },

  async removeThread (threadId: TT.ThreadId): Promise<TT.BlockId> {
    return await TextileNode.removeThread(threadId)
  },

  async threads (): Promise<TT.Threads> {
    const jsonString = await TextileNode.threads()
    const threads = JSON.parse(jsonString) as TT.Threads
    return threads
  },

  async addThreadInvite (threadId: TT.ThreadId, inviteePk: TT.PublicKey): Promise<TT.BlockId> {
    return await TextileNode.addThreadInvite(threadId, inviteePk)
  },

  async addExternalThreadInvite (id: TT.ThreadId): Promise<TT.ExternalInvite> {
    const jsonString = await TextileNode.addExternalThreadInvite(id)
    const externalInvite = JSON.parse(jsonString) as TT.ExternalInvite
    return externalInvite
  },

  async acceptExternalThreadInvite (inviteId: TT.BlockId, key: TT.PrivateKey): Promise<TT.BlockId> {
    return await TextileNode.acceptExternalThreadInvite(inviteId, key)
  },

  async addPhoto (path: string): Promise<TT.AddResult> {
    const jsonString = await TextileNode.addPhoto(path)
    const addResult = JSON.parse(jsonString) as TT.AddResult
    return addResult
  },

  async addPhotoToThread (dataId: TT.PhotoId, key: TT.PrivateKey, threadId: TT.ThreadId, caption?: string): Promise<TT.BlockId> {
    return await TextileNode.addPhotoToThread(dataId, key, threadId, caption)
  },

  async sharePhotoToThread (dataId: TT.PhotoId, threadId: TT.ThreadId, caption?: string): Promise<TT.BlockId> {
    return await TextileNode.sharePhotoToThread(dataId, threadId, caption)
  },

  async getPhotos (limit: number, threadId: TT.ThreadId, offset: string = ''): Promise<TT.Photo[]> {
    const jsonString = await TextileNode.getPhotos(offset, limit, threadId)
    const result = JSON.parse(jsonString) as TT.GetPhotosResult
    return result.items
  },

  async getPhotoData (id: TT.PhotoId, path: string): Promise<TT.ImageData> {
    const jsonString = await TextileNode.getPhotoData(id, path)
    const imageData = JSON.parse(jsonString) as TT.ImageData
    return imageData
  },

  async getPhotoThreads (id: TT.PhotoId): Promise<TT.Threads> {
    const jsonString = await TextileNode.getPhotoThreads(id)
    const threads = JSON.parse(jsonString) as TT.Threads
    return threads
  },

  async getPhotoKey (id: TT.PhotoId): Promise<TT.PrivateKey> {
    const key = await TextileNode.getPhotoKey(id)
    return key
  },

  async ignorePhoto (blockId: TT.BlockId): Promise<TT.BlockId> {
    return await TextileNode.ignorePhoto(blockId)
  },

  async addPhotoComment (blockId: TT.BlockId, body: string): Promise<TT.BlockId> {
    return await TextileNode.addPhotoComment(blockId, body)
  },

  async ignorePhotoComment (blockId: TT.BlockId): Promise<TT.BlockId> {
    return await TextileNode.ignorePhotoComment(blockId)
  },

  async addPhotoLike (blockId: TT.BlockId): Promise<TT.BlockId> {
    return await TextileNode.addPhotoLike(blockId)
  },

  async ignorePhotoLike (blockId: TT.BlockId): Promise<TT.BlockId> {
    return await TextileNode.ignorePhotoLike(blockId)
  },

  async addDevice (name: TT.DeviceName, pubKey: TT.DeviceId): Promise<void> {
    return await TextileNode.addDevice(name, pubKey)
  },

  async removeDevice (id: TT.DeviceId): Promise<void> {
    return await TextileNode.removeDevice(id)
  },

  async devices (): Promise<TT.Devices> {
    const jsonString = await TextileNode.devices()
    const devices = JSON.parse(jsonString) as TT.Devices
    return devices
  },

  async getFilePath (uri: string): Promise<string> {
    return await TextileNode.getFilePath(uri)
  },

  async refreshMessages (): Promise<void> {
    return await TextileNode.refreshMessages()
  },

  async getNotifications (limit: number, offset: string = ''): Promise<TT.GetNotificationsResult> {
    const jsonString = await TextileNode.getNotifications(offset, limit)
    return JSON.parse(jsonString) as TT.GetNotificationsResult
  },

  async countUnreadNotifications (): Promise<number> {
    return await TextileNode.countUnreadNotifications()
  },

  async readNotification (id: TT.NotificationId): Promise<void> {
    return await TextileNode.readNotification(id)
  },

  async readAllNotifications (): Promise<void> {
    return await TextileNode.readAllNotifications()
  },

  async acceptThreadInviteViaNotification (id: TT.NotificationId): Promise<TT.BlockId> {
    return await TextileNode.acceptThreadInviteViaNotification(id)
  },

  async getContacts (): Promise<TT.GetContactsResult> {
    const jsonString = await TextileNode.getContacts()
    return JSON.parse(jsonString) as TT.GetContactsResult
  },

  eventEmitter: Platform.select({
    android: DeviceEventEmitter,
    ios: new NativeEventEmitter(Events)
  })
}
