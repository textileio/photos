import FS from 'react-native-fs'
import Config from 'react-native-config'
import { all, call, put, select } from 'redux-saga/effects'
import { Dispatch } from 'redux'
import { keepScreenOn, letScreenSleep } from '../NativeModules/ScreenControl'
import MigrationActions from '../Redux/MigrationRedux'
import { getAnnouncement, getNetwork } from '../Redux/MigrationSelectors'
import { getAddress, getUsername, getPeerId } from '../Redux/AccountSelectors'

import {
  addContact
 } from '../NativeModules/Textile'

const PREVIOUS_ID_PATH = `${FS.DocumentDirectoryPath}/migration005_peerid.ndjson`
const PHOTOS_FILE_PATH = `${FS.DocumentDirectoryPath}/migration005_default_photos.ndjson`
const THREADS_FILE_PATH = `${FS.DocumentDirectoryPath}/migration005_threads.ndjson`
const IMAGE_URL = (id: string, key: string) => `https://cafe.textile.io/ipfs/${id}/photo?key=${key}`
const MIGRATION_IMAGES_PATH = `${FS.DocumentDirectoryPath}/migration_images`
const IMAGE_PATH = (id: string) => `${MIGRATION_IMAGES_PATH}/${id}.jpg`

interface PhotoItem {
  id: string,
  key: string
}
interface PeerIdItem {
  peerid: string
}

interface ThreadItem {
  name: string,
  sk: string,
  peers: string[]
}

export function * migrate(dispatch: Dispatch) {
  // Take some sort of action to start the migration
  yield call(keepScreenOn)
  yield call(FS.mkdir, MIGRATION_IMAGES_PATH)
  const photoItems: PhotoItem[] = yield call(getItems, PHOTOS_FILE_PATH)
  const threadItems: ThreadItem[] = yield call(getItems, THREADS_FILE_PATH)
  yield put(MigrationActions.migrationMetadata(photoItems.length, threadItems.length))
  const downloadEffects = photoItems.map((item) => call(downloadPhoto, item, dispatch))
  yield all(downloadEffects)
  yield call(letScreenSleep)
}

// Can be run on each node online
export function * runRecurringMigrationTasks () {
  const announcement = yield select(getAnnouncement)
  if (announcement) {
    const {peerId, address, username, previous} = announcement
    try {
      yield call(announceMigration, peerId, address, username, previous)
    } finally {
      // If no error, mark as successful
      yield put(MigrationActions.announceSuccess())
    }
  }
  const peers = yield select(getNetwork)
  for (const peer of peers) {
    try {
      // for each contact ask if they've migrated
      const contact = yield call(findContact, peer)
      if (contact) {
        yield call(addContact, contact.peerId, contact.address, contact.username || '')
      } else {
        throw new Error('peer not found')
      }
    } finally {
      // If no error, mark as successful
      yield put(MigrationActions.connectionSuccess(peer))
    }
  }
}

// Should be run the first time
export function * migrateConnections() {
  // announce to other peers
  const previousItems: PeerIdItem[] = yield call(getItems, PREVIOUS_ID_PATH)
  if (previousItems.length) {
    const previous = previousItems[0]
    const peerId = yield select(getPeerId)
    const address = yield select(getAddress)
    const username = yield select(getUsername) || ''
    yield put(MigrationActions.announceMigration(peerId, address, username, previous.peerid))
  }
  // locate old peers
  const threadItems: ThreadItem[] = yield call(getItems, THREADS_FILE_PATH)
  const peers = [...new Set(([] as string[]).concat(...threadItems.map((thread) => thread.peers)))]
  yield put(MigrationActions.connectToPeers(peers))
  // run it for the first time
  yield call(runRecurringMigrationTasks)
}

// Will error for any non-success
export async function announceMigration(peerId: string, address: string, username: string, previousId: string) {
  const headers = {'Content-type': 'application/json'}
  const body = JSON.stringify({ peerId, previousId, address, username })
  const response = await fetch(Config.RN_PEER_SWAP, { method: 'POST', headers, body })
  if (!(response.status >= 200 && response.status < 300)) {
    throw Error('Request failed')
  }
}

// will error response doesn't include the peer
export async function findContact(peerId: string): Promise<{peerId: string, address: string, username?: string} | undefined> {
  const response = await fetch(`${Config.RN_PEER_SWAP_API}?peerId=${peerId}`, { method: 'GET' })
  const responseJson: [{peerId: string, address: string, username?: string}] = await response.json()
  return responseJson[0]
}

function * downloadPhoto(item: PhotoItem, dispatch: Dispatch) {
  const options: FS.DownloadFileOptions = {
    fromUrl: IMAGE_URL(item.id, item.key),
    toFile: IMAGE_PATH(item.id),
    connectionTimeout: 5000,
    readTimeout: 5000,
    begin: (begin) => {
      const { jobId, statusCode, contentLength } = begin
      dispatch(MigrationActions.downloadStarted(jobId, statusCode, contentLength))
    },
    progress: (progress) => {
      const { jobId, bytesWritten } = progress
      dispatch(MigrationActions.downloadProgress(jobId, bytesWritten))
    }
  }
  const result: FS.DownloadResult = yield call(startDownload, options, dispatch)
  const { jobId, statusCode, bytesWritten } = result
  yield put(MigrationActions.downloadComplete(jobId, statusCode, bytesWritten))
}

// function * upload() {
//   const options: FS.UploadFileOptions = {
//     toUrl: 'aurl',
//     files: [],
//     headers: {

//     },
//     begin: (begin) => console.log(begin),
//     progress: (progress) => console.log(progress)
//   }
//   FS.uploadFiles(options)
// }

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

function startDownload(options: FS.DownloadFileOptions, dispatch: Dispatch) {
  const result = FS.downloadFile(options)
  dispatch(MigrationActions.insertDownload(result.jobId, options.toFile))
  return result.promise
}
