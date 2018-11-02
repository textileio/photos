import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform
} from 'react-native'

const { TextileNode, Events } = NativeModules

export async function acceptExternalThreadInvite(id_: string, key: string): Promise<string> {
  const result = await TextileNode.acceptExternalThreadInvite(id_, key)
  return result
}

export async function acceptThreadInviteViaNotification(id_: string): Promise<void> {
  const result = await TextileNode.acceptThreadInviteViaNotification(id_)
  return result
}

export async function addExternalThreadInvite(threadId: string): Promise<void> {
  const result = await TextileNode.addExternalThreadInvite(threadId)
  return result
}

export async function addPhoto(path: string): Promise<void> {
  const result = await TextileNode.addPhoto(path)
  return result
}

export async function addPhotoComment(blockId: string, body: string): Promise<void> {
  const result = await TextileNode.addPhotoComment(blockId, body)
  return result
}

export async function addPhotoLike(blockId: string): Promise<void> {
  const result = await TextileNode.addPhotoLike(blockId)
  return result
}

export async function addPhotoToThread(dataId: string, key: string, threadId: string, caption: string): Promise<void> {
  const result = await TextileNode.addPhotoToThread(dataId, key, threadId, caption)
  return result
}

export async function addThread(name: string): Promise<void> {
  const result = await TextileNode.addThread(name)
  return result
}

export async function addThreadInvite(threadId: string, inviteeId: string): Promise<void> {
  const result = await TextileNode.addThreadInvite(threadId, inviteeId)
  return result
}

export async function address(): Promise<string> {
  return await TextileNode.address()
}

export async function cafeSession(peerId: string): Promise<void> {
  const result = await TextileNode.cafeSession(peerId)
  return result
}

export async function cafeSessions(): Promise<void> {
  const result = await TextileNode.cafeSessions()
  return result
}

export async function checkCafeMail(): Promise<void> {
  return await TextileNode.checkCafeMail()
}

export async function contact(id_: string): Promise<void> {
  const result = await TextileNode.contact(id_)
  return result
}

export async function contactThreads(id_: string): Promise<void> {
  const result = await TextileNode.contactThreads(id_)
  return result
}

export async function contactUsername(id_: string): Promise<void> {
  const result = await TextileNode.contactUsername(id_)
  return result
}

export async function contacts(): Promise<void> {
  const result = await TextileNode.contacts()
  return result
}

export async function countUnreadNotifications(): Promise<number> {
  const result = await TextileNode.countUnreadNotifications()
  return result
}

export async function deregisterCafe(peerId: string): Promise<void> {
  return await TextileNode.deregisterCafe(peerId)
}

export async function ignorePhoto(blockId: string): Promise<void> {
  const result = await TextileNode.ignorePhoto(blockId)
  return result
}

export async function ignorePhotoComment(blockId: string): Promise<void> {
  const result = await TextileNode.ignorePhotoComment(blockId)
  return result
}

export async function ignorePhotoLike(blockId: string): Promise<void> {
  const result = await TextileNode.ignorePhotoLike(blockId)
  return result
}

export async function notifications(offset: string, limit: number): Promise<void> {
  const result = await TextileNode.notifications(offset, limit)
  return result
}

export async function overview(): Promise<void> {
  const result = await TextileNode.overview()
  return result
}

export async function peerId(): Promise<void> {
  const result = await TextileNode.peerId()
  return result
}

export async function peerProfile(peerId: string): Promise<void> {
  const result = await TextileNode.peerProfile(peerId)
  return result
}

export async function photoData(id_: string, path: string): Promise<void> {
  const result = await TextileNode.photoData(id_, path)
  return result
}

export async function photoDataForMinWidth(id_: string, minWidth: number): Promise<void> {
  const result = await TextileNode.photoDataForMinWidth(id_, minWidth)
  return result
}

export async function photoKey(id_: string): Promise<void> {
  const result = await TextileNode.photoKey(id_)
  return result
}

export async function photoMetadata(id_: string): Promise<void> {
  const result = await TextileNode.photoMetadata(id_)
  return result
}

export async function photoThreads(id_: string): Promise<void> {
  const result = await TextileNode.photoThreads(id_)
  return result
}

export async function photos(offset: string, limit: number, threadId: string): Promise<void> {
  const result = await TextileNode.photos(offset, limit, threadId)
  return result
}

export async function profile(): Promise<void> {
  const result = await TextileNode.profile()
  return result
}

export async function readAllNotifications(): Promise<void> {
  return await TextileNode.readAllNotifications()
}

export async function readNotification(id_: string): Promise<void> {
  return await TextileNode.readNotification(id_)
}

export async function refreshCafeSession(cafeId: string): Promise<void> {
  const result = await TextileNode.refreshCafeSession(cafeId)
  return result
}

export async function registerCafe(peerId: string): Promise<void> {
  return await TextileNode.registerCafe(peerId)
}

export async function removeThread(id_: string): Promise<void> {
  const result = await TextileNode.removeThread(id_)
  return result
}

export async function seed(): Promise<void> {
  const result = await TextileNode.seed()
  return result
}

export async function setAvatar(id_: string): Promise<void> {
  return await TextileNode.setAvatar(id_)
}

export async function setUsername(username: string): Promise<void> {
  return await TextileNode.setUsername(username)
}

export async function sharePhotoToThread(dataId: string, threadId: string, caption: string): Promise<void> {
  const result = await TextileNode.sharePhotoToThread(dataId, threadId, caption)
  return result
}

export async function start(): Promise<void> {
  return await TextileNode.start()
}

export async function stop(): Promise<void> {
  return await TextileNode.stop()
}

export async function threadInfo(threadId: string): Promise<void> {
  const result = await TextileNode.threadInfo(threadId)
  return result
}

export async function threads(): Promise<void> {
  const result = await TextileNode.threads()
  return result
}

export async function username(): Promise<void> {
  return await TextileNode.username()
}

export async function version(): Promise<void> {
  return await TextileNode.version()
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

export async function newWallet(wordCount: number): Promise<void> {
  const result = await TextileNode.newWallet(wordCount)
  return result
}

export async function walletAccountAt(phrase: string, index: number, password: string): Promise<void> {
  const result = await TextileNode.walletAccountAt(phrase, index, password) // return seed and address
  return result
}
