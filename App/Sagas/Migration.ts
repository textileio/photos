import { Alert } from 'react-native'
import FS, { StatResult } from 'react-native-fs'
import Config from 'react-native-config'
import { all, call, put, select, take, race, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { getType } from 'typesafe-actions'
import { Dispatch } from 'redux'
import { keepScreenOn, letScreenSleep } from '@textile/react-native-screen-control'
import MigrationActions, { MigrationPhoto, PeerDetails, PhotoDownload, LocalProcessingTask } from '../Redux/MigrationRedux'
import { getAnnouncement, getNetwork, getMigrationPhotos, completeDownloads, completeLocalProcessingTasks, allLocalProcessingTasks } from '../Redux/MigrationSelectors'
import { getPeerId } from '../Redux/AccountSelectors'
import { prepare } from './ImageSharingSagas'
import { getSession } from './Account/AccountSagas'

import Textile, {
  ThreadInfo,
  ContactInfo,
  Protobufs,
  ThreadType,
  ThreadSharing,
  SchemaType
 } from '@textile/react-native-sdk'

const PREVIOUS_ID_PATH = () => `${Textile.repoPath}/migration005_peerid.ndjson`
const PHOTOS_FILE_PATH = () => `${Textile.repoPath}/migration005_default_photos.ndjson`
const THREADS_FILE_PATH = () => `${Textile.repoPath}/migration005_threads.ndjson`
const IMAGE_URL = (id: string, key: string) => `https://cafe.textile.io/ipfs/${id}/photo?key=${key}`
const MIGRATION_IMAGES_PATH = `${FS.DocumentDirectoryPath}/migration_images`
const IMAGE_PATH = (id: string) => `${MIGRATION_IMAGES_PATH}/${id}.jpg`
const MIGRATION_ALBUM_KEY = 'textile_photos-migrated-photos'
const MIGRATION_ALBUM_NAME = 'Migrated photos'

interface PeerIdItem {
  peerid: string
  username?: string
}

interface ThreadItem {
  name: string,
  sk: string,
  peers: string[]
}

export function * handleMigrationRequest(dispatch: Dispatch) {
  while (true) {
    try {
      yield take(getType(MigrationActions.requestMigration))
      const response: MigrationResponse = yield call(migrationPrompt)
      switch (response) {
        case MigrationResponse.cancel:
          yield put(MigrationActions.cancelMigration())
        case MigrationResponse.later:
          continue
        case MigrationResponse.proceed:
          yield call(runMigrationOrCancel, dispatch)
      }
    } catch {
      // don't worry about it
    }
  }
}

function * runMigrationOrCancel(dispatch: Dispatch) {
  yield race({
    processMigation: call(processMigration, dispatch),
    cancel: take(getType(MigrationActions.cancelMigration))
  })
}

export function * handleRetryMigration(dispatch: Dispatch) {
  while (true) {
    yield take(getType(MigrationActions.retryMigration))
    yield call(cleanupArtifacts)
    yield fork(runMigrationOrCancel, dispatch)
  }
}

export function * handleCancelMigration() {
  while (true) {
    yield take(getType(MigrationActions.cancelMigration))
    yield call(cleanupMigrationFiles)
    yield call(cleanupArtifacts)
  }
 }

 // Announce the new peerId as soon as migration of node happens
export function * handleMigrationNeeded() {
  while (true) {
    yield take(getType(MigrationActions.migrationNeeded))
    yield call(announcePeer)
  }
}

function * processMigration(dispatch: Dispatch) {
  try {
    yield put(MigrationActions.migrationStarted())
    yield call(keepScreenOn)
    yield call(announcePeer)
    yield call(delay, 5000)
    yield call(connectToPeers)
    yield call(delay, 5000)
    // Kick this off the first time, it will be run in NodeOnline in the future
    yield put(MigrationActions.requestRunRecurringMigrationTasks())
    yield call(downloadOldPhotos, dispatch)
    yield call(prepareAndAddPhotos)
    yield call(processAllRemotePins, dispatch)
    yield call(cleanupMigrationFiles)
    yield put(MigrationActions.migrationComplete())
    yield call(delay, 1000)
    yield call(Alert.alert, 'Migration complete!')
  } catch (error) {
    yield put(MigrationActions.migrationError(error))
  } finally {
    yield call(letScreenSleep)
    yield call(cleanupArtifacts)
  }
}

function * downloadOldPhotos (dispatch: Dispatch) {
  const items: MigrationPhoto[] = yield call(getItems, PHOTOS_FILE_PATH())
  if (items.length < 1) {
    return
  }
  yield put(MigrationActions.photoMigration(items))
  yield call(FS.mkdir, MIGRATION_IMAGES_PATH)
  const photoItems: MigrationPhoto[] = yield select(getMigrationPhotos)
  const downloadEffects = photoItems.map((item) => call(downloadPhoto, item, dispatch))
  yield all(downloadEffects)
}

function * prepareAndAddPhotos() {
  const downloads: PhotoDownload[] = yield select(completeDownloads)
  if (downloads.length < 1) {
    return
  }
  const threadInfo: ThreadInfo = yield call(Textile.addThread, MIGRATION_ALBUM_KEY, MIGRATION_ALBUM_NAME, ThreadType.PRIVATE, ThreadSharing.NOT_SHARED, [], SchemaType.MEDIA)
  const effects = downloads.map((download) => call(prepareAndAddPhoto, download, threadInfo.id))
  yield all(effects)
}

function * prepareAndAddPhoto(download: PhotoDownload, threadId: string) {
  const { photoId, path } = download
  try {
    const img = {
      isAvatar: false,
      origURL: path,
      uri: path,
      path,
      canDelete: true
    }
    yield put(MigrationActions.insertLocalProcessingTask(photoId))
    const preparedFiles: Protobufs.IMobilePreparedFiles = yield call(prepare, img, threadId)
    const { dir } = preparedFiles
    if (!dir) {
      throw new Error('No dir on MobilePreparedFiles')
    }
    yield call(Textile.addFiles, dir, threadId)
    yield put(MigrationActions.localProcessingTaskComplete(photoId, preparedFiles))
  } catch (error) {
    yield put(MigrationActions.localProcessingTaskError(photoId, error))
  }
}

function * processAllRemotePins(dispatch: Dispatch) {
  const tasks: LocalProcessingTask[] = yield select(completeLocalProcessingTasks)
  if (tasks.length < 1) {
    return
  }
  const effects = tasks.map((task) => call(processRemotePins, task, dispatch))
  yield all(effects)
}

function * processRemotePins(task: LocalProcessingTask, dispatch: Dispatch) {
  if (!task.preparedFiles || !task.preparedFiles.pin) {
    return
  }
  const pin = task.preparedFiles.pin
  const effects = Object.keys(pin).map((photoId) => {
    const path = pin[photoId]
    return call(uploadPhoto, photoId, path, dispatch)
  })
  yield all(effects)
}

function * cleanupMigrationFiles() {
  yield call(deleteFile, (PREVIOUS_ID_PATH()))
  yield call(deleteFile, THREADS_FILE_PATH())
  yield call(deleteFile, PHOTOS_FILE_PATH())
}

function * cleanupArtifacts() {
  yield call(deleteFile, MIGRATION_IMAGES_PATH)
  const tasks: LocalProcessingTask[] = yield select(allLocalProcessingTasks)
  const tasksEffects = tasks.map((task) => call(deleteFilesForTask, task))
  yield all(tasksEffects)
}

function * deleteFilesForTask(task: LocalProcessingTask) {
  if (!task.preparedFiles || !task.preparedFiles.pin) {
    return
  }
  const pin = task.preparedFiles.pin
  const effects = Object.keys(pin).map((photoId) => {
    const path = pin[photoId]
    return call(deleteFile, path)
  })
  yield all(effects)
}

// Exporting this so we can call it early so the old username is available during onboarding
export function * announcePeer() {
  // announce to other peers
  const previousItems: PeerIdItem[] = yield call(getItems, PREVIOUS_ID_PATH())
  if (previousItems.length) {
    const previous = previousItems[0]
    const peerId = yield select(getPeerId)
    let contactInfo: ContactInfo | undefined
    if (peerId) {
      contactInfo = yield call(Textile.contact, peerId)
    }
    const details: PeerDetails = {
      previousPeerId: previous.peerid,
      previousUsername: previous.username,
      currentContactInfo: contactInfo
    }
    yield put(MigrationActions.peerAnnouncement(details))
  }
}

function * connectToPeers() {
  // locate old peers
  const threadItems: ThreadItem[] = yield call(getItems, THREADS_FILE_PATH())
  const peers = [...new Set(([] as string[]).concat(...threadItems.map((thread) => thread.peers)))]
  yield put(MigrationActions.connectToPeers(peers))

}

// Can be run on each node online
export function * runRecurringMigrationTasks () {
  while (true) {
    yield take(getType(MigrationActions.requestRunRecurringMigrationTasks))
    const announcement: { peerDetails: PeerDetails, status: 'complete' | 'pending' } | undefined = yield select(getAnnouncement)
    if (announcement && announcement.status === 'pending' && announcement.peerDetails.currentContactInfo) {
      try {
        yield call(announcePeerDetails, announcement.peerDetails)
        // If no error, mark as successful
        yield put(MigrationActions.peerAnnouncementSuccess())
      } catch (error) {
        // just run again later
      }
    }
    const peers: ReadonlyArray<string> = yield select(getNetwork)
    for (const peer of peers) {
      try {
        // for each contact ask if they've migrated
        const contactInfo: ContactInfo | undefined = yield call(findContact, peer)
        if (contactInfo) {
          yield call(Textile.addContact, contactInfo)
          yield put(MigrationActions.connectionSuccess(peer))
        }
      } catch (error) {
        // just run again later
      }
    }
  }
}

// Will error for any non-success
async function announcePeerDetails(peerDetails: PeerDetails) {
  const headers = {'Content-Type': 'application/json'}
  const contactInfoJsonString = JSON.stringify(peerDetails.currentContactInfo)
  const payload: { [key: string]: string } = { previousPeerId: peerDetails.previousPeerId, currentContactInfo: contactInfoJsonString }
  const previousUsername = peerDetails.previousUsername ? peerDetails.previousUsername.trim() : ''
  if (previousUsername.length > 0) {
    payload['previousUsername'] = previousUsername
  }
  const body = JSON.stringify(payload)
  const response = await fetch(Config.RN_PEER_SWAP, { method: 'POST', headers, body })
  if (!(response.status >= 200 && response.status < 300)) {
    throw Error('Request failed')
  }
}

// will error response doesn't include the peer
async function findContact(peerId: string): Promise<ContactInfo | undefined> {
  const response = await fetch(`${Config.RN_PEER_SWAP}?previousPeerId=${peerId}`, { method: 'GET' })
  const peerDetailsArray: ReadonlyArray<{ previousPeerId: string, previousUsername?: string, currentContactInfo: string }> = await response.json()
  if (peerDetailsArray.length > 0) {
    const contactInfo = JSON.parse(peerDetailsArray[0].currentContactInfo) as ContactInfo
    return contactInfo
  } else {
    return undefined
  }
}

function * downloadPhoto(item: MigrationPhoto, dispatch: Dispatch) {
  try {
    const finalPath = IMAGE_PATH(item.id)
    const options: FS.DownloadFileOptions = {
      fromUrl: IMAGE_URL(item.id, item.key),
      toFile: finalPath,
      connectionTimeout: 5000,
      readTimeout: 5000,
      begin: (begin) => {
        const { statusCode, contentLength } = begin
        dispatch(MigrationActions.downloadStarted(item.id, statusCode, contentLength))
      },
      progress: (progress) => {
        const { bytesWritten } = progress
        dispatch(MigrationActions.downloadProgress(item.id, bytesWritten))
      }
    }
    const result: FS.DownloadResult = yield call(startDownload, item.id, options, dispatch)
    const { statusCode, bytesWritten } = result
    yield put(MigrationActions.downloadComplete(item.id, statusCode, bytesWritten))
  } catch (error) {
    yield put(MigrationActions.downloadError(item.id, error))
  }
}

function * uploadPhoto(photoId: string, path: string, dispatch: Dispatch) {
  try {
    const stats: StatResult = yield call(FS.stat, path)
    const size = + stats.size
    yield put(MigrationActions.insertUpload(photoId, path, size))
    const filename = path.split('/').pop()!
    const session: Protobufs.ICafeSession = yield call(getSession)
    if (!session.cafe) {
      throw new Error('no cafe object')
      return
    }
    const options: FS.UploadFileOptions = {
      toUrl: `${session.cafe.url}${Config.RN_TEXTILE_CAFE_API_PIN_PATH}`,
      files: [{
        name: filename,
        filename,
        filepath: path,
        filetype: 'application/octet-stream'
      }],
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access}`,
        'Content-Type': 'application/octet-stream'
      },
      begin: (begin) => {
        dispatch(MigrationActions.uploadStarted(photoId))
      },
      progress: (progress) => {
        const { totalBytesExpectedToSend, totalBytesSent } = progress
        dispatch(MigrationActions.uploadProgress(photoId, totalBytesExpectedToSend, totalBytesSent))
      }
    }
    const result: FS.UploadResult = yield call(startUpload, photoId, options)
    const { statusCode } = result
    yield put(MigrationActions.uploadComplete(photoId, statusCode))
  } catch (error) {
    yield put(MigrationActions.uploadError(photoId, error))
  }
}

function startDownload(photoId: string, options: FS.DownloadFileOptions, dispatch: Dispatch) {
  const result = FS.downloadFile(options)
  dispatch(MigrationActions.insertDownload(photoId, options.toFile))
  return result.promise
}

function startUpload(photoId: string, options: FS.UploadFileOptions) {
  const result = FS.uploadFiles(options)
  return result.promise
}

async function getItems<T>(path: string) {
  if (await FS.exists(path)) {
    const content = await FS.readFile(path)
    const lines = content.split('\n')
    const items = lines
      .filter((line) => line.length > 0)
      .map((line) => JSON.parse(line) as T)
    return items
  } else {
    return []
  }
}

async function deleteFile(path: string) {
  if (await FS.exists(path)) {
    await FS.unlink(path)
  }
}

enum MigrationResponse {
  proceed,
  later,
  cancel
}

function migrationPrompt(): Promise<MigrationResponse> {
  return new Promise<number>((resolve, reject) => {
    Alert.alert(
      'Migration Available',
      'We\'ll import your old Textile peers and photos as best we can. ' +
      'It will require a bit of time, bandwidth, and data transfer, so you should be on WiFi. ' +
      'Please leave Textile Photos running in the foreground until the migration is complete.',
      [
        { text: 'Later', onPress: () => resolve(MigrationResponse.later) },
        { text: 'No Thanks', onPress: () => resolve(MigrationResponse.cancel), style: 'cancel' },
        { text: 'Proceed', onPress: () => resolve(MigrationResponse.proceed) }
      ],
      { cancelable: false }
    )
  })
}
