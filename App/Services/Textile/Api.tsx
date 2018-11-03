import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform
} from 'react-native'

import {
  ExternalInvite,
  AddDataResult,
  Thread,
  Threads,
  CafeSession,
  CafeSessions,
  Contact,
  Contacts,
  Notifications,
  Overview,
  Profile,
  ImageData,
  Photos,
  ThreadInfo,
  WalletAccount
} from './Model'

const { TextileNode, Events } = NativeModules

export const eventEmitter = Platform.select({
  android: DeviceEventEmitter,
  ios: new NativeEventEmitter(Events)
})

export async function acceptExternalThreadInvite(id_: string, key: string): Promise<string> {
  const result = await TextileNode.acceptExternalThreadInvite(id_, key) // returns hash
  return result as string
}

export async function acceptThreadInviteViaNotification(id_: string): Promise<string> {
  const result = await TextileNode.acceptThreadInviteViaNotification(id_) // returns addr
  return result as string
}

export async function addExternalThreadInvite(threadId: string): Promise<ExternalInvite> {
  const result = await TextileNode.addExternalThreadInvite(threadId)
  return JSON.parse(result) as ExternalInvite
}

export async function addPhoto(path: string): Promise<AddDataResult> {
  const result = await TextileNode.addPhoto(path)
  return JSON.parse(result) as AddDataResult
}

export async function addPhotoComment(blockId: string, body: string): Promise<string> {
  const result = await TextileNode.addPhotoComment(blockId, body) // returns hash
  return result as string
}

export async function addPhotoLike(blockId: string): Promise<string> {
  const result = await TextileNode.addPhotoLike(blockId) // returns hash
  return result as string
}

export async function addPhotoToThread(dataId: string, key: string, threadId: string, caption: string): Promise<string> {
  const result = await TextileNode.addPhotoToThread(dataId, key, threadId, caption) // returns hash
  return result as string
}

export async function addThread(name: string): Promise<Thread> {
  const result = await TextileNode.addThread(name)
  return JSON.parse(result) as Thread
}

export async function addThreadInvite(threadId: string, inviteeId: string): Promise<string> {
  const result = await TextileNode.addThreadInvite(threadId, inviteeId) // returns hash
  return result as string
}

export async function address(): Promise<string> {
  const result = await TextileNode.address() // TODO: not sure what this returns
  return result as string
}

export async function cafeSession(peerId: string): Promise<CafeSession> {
  const result = await TextileNode.cafeSession(peerId)
  return JSON.parse(result) as CafeSession
}

export async function cafeSessions(): Promise<CafeSessions> {
  const result = await TextileNode.cafeSessions()
  return JSON.parse(result) as CafeSessions
}

export async function checkCafeMail(): Promise<void> {
  return await TextileNode.checkCafeMail()
}

export async function contact(id_: string): Promise<Contact> {
  const result = await TextileNode.contact(id_)
  return JSON.parse(result) as Contact
}

export async function contactThreads(id_: string): Promise<Threads> {
  const result = await TextileNode.contactThreads(id_)
  return JSON.parse(result) as Threads
}

export async function contactUsername(id_: string): Promise<string> {
  const result = await TextileNode.contactUsername(id_)
  return result as string
}

export async function contacts(): Promise<Contacts> {
  const result = await TextileNode.contacts()
  return JSON.parse(result) as Contacts
}

export async function countUnreadNotifications(): Promise<number> {
  const result = await TextileNode.countUnreadNotifications()
  return result as number
}

export async function deregisterCafe(peerId: string): Promise<void> {
  return await TextileNode.deregisterCafe(peerId)
}

export async function ignorePhoto(blockId: string): Promise<string> {
  const result = await TextileNode.ignorePhoto(blockId) // returns hash
  return result as string
}

export async function ignorePhotoComment(blockId: string): Promise<string> {
  const result = await TextileNode.ignorePhotoComment(blockId) // returns hash
  return result as string
}

export async function ignorePhotoLike(blockId: string): Promise<string> {
  const result = await TextileNode.ignorePhotoLike(blockId) // returns hash
  return result as string
}

export async function notifications(offset: string, limit: number): Promise<Notifications> {
  const result = await TextileNode.notifications(offset, limit)
  return JSON.parse(result) as Notifications
}

export async function overview(): Promise<Overview> {
  const result = await TextileNode.overview()
  return JSON.parse(result) as Overview
}

export async function peerId(): Promise<string> {
  const result = await TextileNode.peerId()
  return result as string
}

export async function peerProfile(peerId: string): Promise<Profile> {
  const result = await TextileNode.peerProfile(peerId)
  return JSON.parse(result) as Profile
}

export async function photoData(id_: string, path: string): Promise<ImageData> {
  const result = await TextileNode.photoData(id_, path)
  return JSON.parse(result) as ImageData
}

export async function photoDataForMinWidth(id_: string, minWidth: number): Promise<ImageData> {
  const result = await TextileNode.photoDataForMinWidth(id_, minWidth)
  return JSON.parse(result) as ImageData
}

export async function photoKey(id_: string): Promise<string> {
  const result = await TextileNode.photoKey(id_) // returns base58 key
  return result as string
}

export async function photoMetadata(id_: string): Promise<any> {
  // TODO: Figure out what DataMetadata is. Just a string: any map?
  const result = await TextileNode.photoMetadata(id_)
  return result
}

export async function photoThreads(id_: string): Promise<Threads> {
  const result = await TextileNode.photoThreads(id_)
  return JSON.parse(result) as Threads
}

export async function photos(offset: string, limit: number, threadId: string): Promise<Photos> {
  const result = await TextileNode.photos(offset, limit, threadId)
  return JSON.parse(result) as Photos
}

export async function profile(): Promise<Profile> {
  const result = await TextileNode.profile()
  return JSON.parse(result) as Profile
}

export async function readAllNotifications(): Promise<void> {
  return await TextileNode.readAllNotifications()
}

export async function readNotification(id_: string): Promise<void> {
  return await TextileNode.readNotification(id_)
}

export async function refreshCafeSession(cafeId: string): Promise<CafeSession> {
  const result = await TextileNode.refreshCafeSession(cafeId)
  return JSON.parse(result) as CafeSession
}

export async function registerCafe(peerId: string): Promise<void> {
  return await TextileNode.registerCafe(peerId)
}

export async function removeThread(id_: string): Promise<string> {
  const result = await TextileNode.removeThread(id_) // returns hash b58 string
  return result as string
}

export async function seed(): Promise<string> {
  const result = await TextileNode.seed() // TODO: make sure this is a string
  return result as string
}

export async function setAvatar(id_: string): Promise<void> {
  return await TextileNode.setAvatar(id_)
}

export async function setUsername(username: string): Promise<void> {
  return await TextileNode.setUsername(username)
}

export async function sharePhotoToThread(dataId: string, threadId: string, caption: string): Promise<string> {
  const result = await TextileNode.sharePhotoToThread(dataId, threadId, caption) // returns hash b58 string
  return result as string
}

export async function start(): Promise<void> {
  return await TextileNode.start()
}

export async function stop(): Promise<void> {
  return await TextileNode.stop()
}

export async function threadInfo(threadId: string): Promise<ThreadInfo> {
  const result = await TextileNode.threadInfo(threadId)
  return JSON.parse(result) as ThreadInfo
}

export async function threads(): Promise<Threads> {
  const result = await TextileNode.threads()
  return JSON.parse(result) as Threads
}

export async function username(): Promise<string> {
  const result = await TextileNode.username()
  return result as string
}

export async function version(): Promise<string> {
  const result = await TextileNode.version()
  return result as string
}

// Order of things to init and create the repo:
// MobileNewTextile If error, inspect it and run next steps or migration
// MobileNewWallet returns mnemonic
// MobileWalletAccountAt returns seed and address
// MobileInitRepo only run one time ever
// MobileNewTextile

export async function initRepo(seed: string, repoPath: string, logLevel: string, logToDisk: boolean): Promise<void> {
  return await TextileNode.initRepo(seed, repoPath, logLevel, logToDisk)
}

export async function migrateRepo(repoPath: string): Promise<void> {
  return await TextileNode.migrateRepo(repoPath)
}

export async function newTextile(repoPath: string): Promise<void> {
  return await TextileNode.newTextile(repoPath)
}

export async function newWallet(wordCount: number): Promise<string> {
  const result = await TextileNode.newWallet(wordCount)
  return result as string
}

export async function walletAccountAt(phrase: string, index: number, password: string): Promise<WalletAccount> {
  const result = await TextileNode.walletAccountAt(phrase, index, password) // return seed and address
  return JSON.parse(result) as WalletAccount
}
