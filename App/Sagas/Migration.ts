import { Alert } from 'react-native'
import FS from 'react-native-fs'
import Config from 'react-native-config'
import { all, call, put, select, take } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { ActionType, getType } from 'typesafe-actions'
import { Dispatch } from 'redux'
import { keepScreenOn, letScreenSleep } from '../NativeModules/ScreenControl'
import MigrationActions, { MigrationPhoto } from '../Redux/MigrationRedux'
import { getAnnouncement, getNetwork, getMigrationPhotos } from '../Redux/MigrationSelectors'
import { getAddress, getPeerId } from '../Redux/AccountSelectors'
import { prepare } from '../Sagas/ImageSharingSagas'
import uuid from 'uuid/v4'

import {
  addContact, addThreadFiles, addThread
 } from '../NativeModules/Textile'

const PREVIOUS_ID_PATH = `${FS.DocumentDirectoryPath}/migration005_peerid.ndjson`
const PHOTOS_FILE_PATH = `${FS.DocumentDirectoryPath}/migration005_default_photos.ndjson`
const THREADS_FILE_PATH = `${FS.DocumentDirectoryPath}/migration005_threads.ndjson`
const IMAGE_URL = (id: string, key: string) => `https://cafe.textile.io/ipfs/${id}/photo?key=${key}`
const MIGRATION_IMAGES_PATH = `${FS.DocumentDirectoryPath}/migration_images`
const IMAGE_PATH = (id: string) => `${MIGRATION_IMAGES_PATH}/${id}.jpg`
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
          yield call(processMigration, dispatch)
      }
    } catch {
      yield put(MigrationActions.photoMigrationError())
    } finally {
      yield call(letScreenSleep)
    }
  }
}

function * processMigration(dispatch: Dispatch) {
  yield put(MigrationActions.migrationStarted())

  // TODO: try/catch

  // yield call(keepScreenOn)
  // // Take some sort of action to start the migration
  // yield call(FS.mkdir, MIGRATION_IMAGES_PATH)
  // // where the photo should be shared when complete
  // const photoItems: MigrationPhoto[] = yield select(getMigrationPhotos)
  // const threadId = yield call(createMigrationAlbum)
  // // the photos ready to migrate
  // // don't think we need this right now...
  // const threadItems: ThreadItem[] = yield call(getItems, THREADS_FILE_PATH)
  // yield put(MigrationActions.migrationMetadata(photoItems.length, threadItems.length))
  // // create the actions
  // const downloadEffects = photoItems.map((item) => call(downloadPhoto, item, threadId, dispatch))
  // // run
  // yield all(downloadEffects)
  // // release
  // yield put(MigrationActions.photoMigrationSuccess())
  // yield call(letScreenSleep)
}

export function * preparePhotoMigration () {
  const photoItems: MigrationPhoto[] = yield call(getItems, PHOTOS_FILE_PATH)
  if (photoItems.length) {
    yield put(MigrationActions.photoMigration(photoItems))
  }
}

async function createMigrationAlbum(): Promise<string> {
  const key = `textile_photos-shared-${uuid()}`
  const threadInfo = await addThread(key, MIGRATION_ALBUM_NAME)
  return threadInfo.id
}

// Can be run on each node online
export function * runRecurringMigrationTasks () {
  while (true) {
    yield take(getType(MigrationActions.requestRunRecurringMigrationTasks))
    const announcement = yield select(getAnnouncement)
    if (announcement) {
      const {peerId, address, username, previousId} = announcement
      try {
        yield call(announceId, peerId, address, username, previousId)
        // If no error, mark as successful
        yield put(MigrationActions.announceSuccess())
      } catch (error) {
        // just run again later
      }
    }
    const peers = yield select(getNetwork)
    for (const peer of peers) {
      try {
        // for each contact ask if they've migrated
        const contact = yield call(findContact, peer)
        if (contact) {
          yield call(addContact, contact.peerId, contact.address, contact.username || '')
          yield put(MigrationActions.connectionSuccess(peer))
        }
      } catch (error) {
        // just run again later
      }
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
    yield put(MigrationActions.announceMigration(peerId, previous.peerid, address, previous.username))
  }
  // locate old peers
  const threadItems: ThreadItem[] = yield call(getItems, THREADS_FILE_PATH)
  const peers = [...new Set(([] as string[]).concat(...threadItems.map((thread) => thread.peers)))]
  yield put(MigrationActions.connectToPeers(peers))
  // run it for the first time
  yield put(MigrationActions.requestRunRecurringMigrationTasks())
}

// Will error for any non-success
export async function announceId(peerId: string, address: string, username: string, previousId: string) {
  const headers = {'Content-type': 'application/json'}
  const body = JSON.stringify({ peerId, previousId, address, username })
  const response = await fetch(Config.RN_PEER_SWAP, { method: 'POST', headers, body })
  if (!(response.status >= 200 && response.status < 300)) {
    throw Error('Request failed')
  }
}

// will error response doesn't include the peer
export async function findContact(peerId: string): Promise<{peerId: string, previousId: string, address: string, username?: string}> {
  const response = await fetch(`${Config.RN_PEER_SWAP}?peerId=${peerId}`, { method: 'GET' })
  const responseJson: [{peerId: string, previousId: string, address: string, username?: string}] = await response.json()
  return responseJson[0]
}

function * downloadPhoto(item: MigrationPhoto, threadId: string, dispatch: Dispatch) {
  const finalPath = IMAGE_PATH(item.id)
  const options: FS.DownloadFileOptions = {
    fromUrl: IMAGE_URL(item.id, item.key),
    toFile: finalPath,
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
  // share the downloaded file to our target thread
  const img = {
    isAvatar: false,
    origURL: finalPath,
    uri: finalPath,
    path: finalPath,
    canDelete: true
  }
  const preparedFile = yield call(prepare, img, threadId)
  const { dir } = preparedFile
  yield call(addThreadFiles, dir, threadId)
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

enum MigrationResponse {
  proceed,
  later,
  cancel
}

function migrationPrompt(): Promise<MigrationResponse> {
  return new Promise<number>((resolve, reject) => {
    Alert.alert(
      'Migration Available',
      'We\'ll import your old Textile Photos peers, threads, and photos as best we can. ' +
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
