/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/
import { AppState } from 'react-native'
import { delay } from 'redux-saga'
import { call, put, select, take } from 'redux-saga/effects'
import BackgroundTimer from 'react-native-background-timer'
import RNFS from 'react-native-fs'
import BackgroundTask from 'react-native-background-task'
import NavigationService from '../Services/NavigationService'
import PhotosNavigationService from '../Services/PhotosNavigationService'
import TextileNode from '../../TextileNode'
import { getAllPhotos, getPhotoPath } from '../Services/PhotoUtils'
import StartupActions from '../Redux/StartupRedux'
import TextileActions, { TextileSelectors } from '../Redux/TextileRedux'
import TextileNodeActions, { TextileNodeSelectors } from '../Redux/TextileNodeRedux'
import AuthActions from '../Redux/AuthRedux'
import UIActions from '../Redux/UIRedux'
import ThreadsActions, { Threads } from '../Redux/ThreadsRedux'
import {params1} from '../Navigation/OnboardingNavigation'
import Upload from 'react-native-background-upload'
import { Buffer } from 'buffer'
import Config from 'react-native-config'
import { ActionType, getType } from 'typesafe-actions'

export function * signUp (action: ActionType<typeof AuthActions.signUpRequest>) {
  const {referralCode, username, email, password} = action.payload.data
  try {
    yield call(TextileNode.signUpWithEmail, username, password, email, referralCode)
    const token = yield call(TextileNode.getAccessToken)
    // TODO: Put username into textile-go for addition to metadata model
    yield put(AuthActions.signUpSuccess(token))
    yield call(NavigationService.navigate, 'OnboardingScreen', params1)
  } catch (error) {
    yield put(AuthActions.signUpFailure(error))
  }
}

export function * logIn (action: ActionType<typeof AuthActions.logInRequest>) {
  const {username, password} = action.payload.data
  try {
    yield call(TextileNode.signIn, username, password)
    const token = yield call(TextileNode.getAccessToken)
    yield put(AuthActions.logInSuccess(token))
    yield call(NavigationService.navigate, 'OnboardingScreen', params1)
  } catch (error) {
    yield put(AuthActions.logInFailure(error))
  }
}

export function * recoverPassword (action: ActionType<typeof AuthActions.recoverPasswordRequest>) {
  // TODO: const {username} = action.payload.data
  try {
    yield delay(2000)
    yield put(AuthActions.recoverPasswordSuccess())
  } catch (error) {
    yield put(AuthActions.recoverPasswordFailure(error))
  }
}

export function * viewPhoto () {
  yield call(PhotosNavigationService.navigate, 'PhotoViewer')
}

export function * toggleBackgroundTimer (action: ActionType<typeof TextileNodeActions.lock>) {
  if (action.payload.value) {
    yield call(BackgroundTimer.start)
  } else {
    yield call(BackgroundTimer.stop)
    yield call(BackgroundTask.finish)
  }
}

export function * initializeAppState () {
  yield take(getType(StartupActions.startup))
  const defaultAppState = yield select(TextileNodeSelectors.appState)
  let queriedAppState = defaultAppState
  while (queriedAppState.match(/default|unknown/)) {
    yield delay(10)
    const currentAppState = yield call(() => AppState.currentState)
    queriedAppState = currentAppState || 'unknown'
  }
  yield put(TextileNodeActions.appStateChange(defaultAppState, queriedAppState))
}

export function * handleNewAppState (action: ActionType<typeof TextileNodeActions.appStateChange>) {
  const { previousState, newState } = action.payload
  console.log('handleNewAppState', previousState, newState)
  if (previousState.match(/default|unknown/) && newState === 'background') {
    console.tron.logImportant('launched into background')
    yield * triggerCreateNode()
  } else if (previousState.match(/default|unknown|inactive|background/) && newState === 'active') {
    console.tron.logImportant('app transitioned to foreground')
    yield put(TextileNodeActions.lock(false))
    yield * triggerCreateNode()
  } else if (previousState.match(/inactive|active/) && newState === 'background') {
    console.tron.logImportant('app transitioned to background')
    yield * triggerStopNode()
  }
}

export function * triggerCreateNode () {
  const locked = yield select(TextileNodeSelectors.locked)
  if (locked) {
    return
  }
  yield put(TextileNodeActions.lock(true))
  yield put(TextileNodeActions.createNodeRequest(RNFS.DocumentDirectoryPath))
}

export function * triggerStopNode () {
  yield put(TextileNodeActions.stopNodeRequest())
}

export function * createNode (action: ActionType<typeof TextileNodeActions.createNodeRequest>) {
  const { path } = action.payload
  try {
    const logLevel = (__DEV__ ? 'DEBUG' : 'INFO')
    const logFiles = !__DEV__
    yield call(TextileNode.create, path, Config.TEXTILE_API_URI, logLevel, logFiles)
    yield call(TextileNode.addThread, "default")
    yield call(TextileNode.addThread, Config.ALL_THREAD_NAME, Config.ALL_THREAD_MNEMONIC)
    yield put(TextileNodeActions.createNodeSuccess())
    yield put(TextileNodeActions.startNodeRequest())
  } catch (error) {
    yield put(TextileNodeActions.createNodeFailure(error))
    yield put(TextileNodeActions.lock(false))
  }
}

export function * startNode () {
  const onboarded = yield select(TextileSelectors.onboarded)
  if (!onboarded) {
    yield put(TextileNodeActions.lock(false))
    return
  }
  try {
    yield call(TextileNode.start)
    yield put(TextileNodeActions.startNodeSuccess())
    yield put(TextileNodeActions.getPhotoHashesRequest('default'))
    yield put(TextileNodeActions.getPhotoHashesRequest(Config.ALL_THREAD_NAME))
    yield put(ThreadsActions.refreshThreadsRequest())
  } catch (error) {
    yield put(TextileNodeActions.startNodeFailure(error))
    yield put(TextileNodeActions.lock(false))
  }
}

export function * stopNode () {
  yield put(TextileNodeActions.lock(true))
  try {
    yield call(TextileNode.stop)
    yield put(TextileNodeActions.stopNodeSuccess())
  } catch (error) {
    yield put(TextileNodeActions.stopNodeFailure(error))
  } finally {
    yield put(TextileNodeActions.lock(false))
  }
}

export function * getPhotoHashes (action: ActionType<typeof TextileNodeActions.getPhotoHashesRequest>) {
  const { thread } = action.payload
  try {
    const items = yield call(TextileNode.getPhotoBlocks, -1, thread, undefined)
    let data = []
    for (let item of items) {
      try {
        const captionsrc = yield call(TextileNode.getBlockData, item.id, 'caption')
        const caption = Buffer.from(captionsrc, 'base64').toString('utf8')
        item = {...item, caption}
      } catch (err) {
        // gracefully return an empty caption for now
      }
      try {
        const metasrc = yield call(TextileNode.getFileData, item.target, 'meta')
        const meta = JSON.parse(Buffer.from(metasrc, 'base64').toString('utf8'))
        meta.username = meta.un // FIXME
        item = {...item, meta}
      } catch (err) {
        // gracefully return an empty meta for now
      }
      item.hash = item.target // FIXME
      data.push({...item})
    }
    yield put(TextileNodeActions.getPhotoHashesSuccess(thread, data))
  } catch (error) {
    yield put(TextileNodeActions.getPhotoHashesFailure(thread, error))
  }
}

export function * pairNewDevice (action) {
  const { pubKey } = action
  try {
    // TODO: Get/make a device id
    yield call(TextileNode.addDevice, 'someId', pubKey)
    yield put(TextileActions.pairNewDeviceSuccess(pubKey))
  } catch (err) {
    yield put(TextileActions.pairNewDeviceError(pubKey))
  }
}

export function * shareImage (action: ActionType<typeof UIActions.sharePhotoRequest>) {
  const {thread, hash, caption} = action.payload
  try {
    // TODO: sharePhoto returns a String. Should we be using it?
    yield call(TextileNode.sharePhoto, hash, thread, caption)
    yield put(TextileNodeActions.getPhotoHashesRequest(thread))
  } catch (error) {
    yield put(UIActions.imageSharingError(error))
  }
}

export function * photosTask () {
  try {
    const camera = yield select(TextileSelectors.camera)
    let allPhotos = yield call(getAllPhotos)

    // for new users, just grab their latest photos
    if (camera.processed === undefined) {
      const ignoredPhotos = allPhotos.splice(1)
      yield put(TextileActions.urisToIgnore(ignoredPhotos.map(photo => photo.uri)))
    }

    const processed = camera && camera.processed ? camera.processed : {}
    const photos = allPhotos.filter((photo) => {
      switch (processed[photo.uri] !== undefined && processed[photo.uri] !== 'error') {
        case (true):
          return false
        default:
          return true
      }
    })

    // ensure that no other jobs try to process the same photo
    yield put(TextileActions.photosProcessing(photos))

    let photoUploads = []
    // Convert all our new entries to thumbs before anything else
    for (let photo of photos.reverse()) {
      try {
        photo = yield call(getPhotoPath, photo)
        const multipartData = yield call(TextileNode.addPhoto, photo.path, 'default')
        photoUploads.push({
          photo: photo,
          multipartData
        })
      } catch (error) {
        // if error, delete the photo copy and thumb from disk then fire error
        try {
          yield call(RNFS.unlink, photo.path)
        } finally {
          yield put(TextileActions.photoProcessingError(photo.uri, error))
        }
      }
    }
    // refresh our gallery
    yield put(TextileNodeActions.getPhotoHashesRequest('default'))
    // initialize and complete our uploads
    for (let photoData of photoUploads) {
      let {photo, multipartData} = photoData
      try {
        yield put(TextileActions.imageAdded(photo.uri, 'default', multipartData.boundary, multipartData.payloadPath))
        yield uploadFile(multipartData.boundary, multipartData.boundary, multipartData.payloadPath)
      } catch (error) {
        yield put(TextileActions.photoProcessingError(photo.uri, error))
      } finally {
        // no matter what, after add/update try to unlink the file from drive
        try {
          yield call(RNFS.unlink, photo.path)
        } catch (error) {
          yield put(TextileActions.photoProcessingError(photo.uri, error))
        }
      }
    }
  } catch (error) {
    yield put(TextileActions.photosTaskError(error))
  } finally {
    const appState = yield select(TextileNodeSelectors.appState)
    if (appState.match(/background/)) {
      yield * stopNode()
    } else {
      yield put(TextileNodeActions.lock(false))
    }
  }
}

export function * removePayloadFile ({data}) {
  const { id } = data
  const items = yield select(TextileSelectors.itemsById, id)
  for (const item of items) {
    if (item.remotePayloadPath && item.state === 'complete') {
      // TODO: probably should be a try/catch?
      yield call(RNFS.unlink, item.remotePayloadPath)
    }
  }
  yield put(TextileActions.imageRemovalComplete(id))
}

export function * retryUploadAfterError ({data}) {
  const { id } = data
  const items = yield select(TextileSelectors.itemsById, id)
  for (const item of items) {
    if (item.remainingUploadAttempts > 0) {
      yield put(TextileActions.imageUploadRetried(item.hash))
      yield uploadFile(item.hash, item.hash, item.remotePayloadPath)
    }
  }
}

function * uploadFile (id: string, boundary: string, payloadPath: string) {
  yield call(
    Upload.startUpload,
    {
      customUploadId: id,
      path: payloadPath,
      url: 'https://ipfs.textile.io/api/v0/add?wrap-with-directory=true',
      method: 'POST',
      type: 'raw-multipart',
      boundary: boundary
    }
  )
}

export function * addThread (action: ActionType<typeof ThreadsActions.addThreadRequest>) {
  try {
    const threadId: string = yield call(TextileNode.addThread, action.payload.name, action.payload.mnemonic)
    yield put(ThreadsActions.addThreadSuccess(action.payload.tmpId, threadId))
  } catch (error) {
    yield put(ThreadsActions.addThreadError(action.payload.tmpId, error))
  }
}

export function * removeThread (action: ActionType<typeof ThreadsActions.removeThreadRequest>) {
  try {
    yield call(TextileNode.removeThread, action.payload.id)
    yield put(ThreadsActions.removeThreadSuccess(action.payload.id))
  } catch (error) {
    yield put(ThreadsActions.removeThreadError(action.payload.id, error))
  }
}

export function * refreshThreads () {
  try {
    const threads: Threads = yield call(TextileNode.threads)
    yield put(ThreadsActions.refreshThreadsSuccess(threads))
  } catch (error) {
    yield put(ThreadsActions.refreshThreadsError(error))
  }
}
