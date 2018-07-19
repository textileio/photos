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
import { AppState, Share } from 'react-native'
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
import TextileNodeActions, { TextileNodeSelectors, PhotosQueryResult } from '../Redux/TextileNodeRedux'
import { PreferencesSelectors } from '../Redux/PreferencesRedux'
import AuthActions from '../Redux/AuthRedux'
import UIActions from '../Redux/UIRedux'
import ThreadsActions from '../Redux/ThreadsRedux'
import DevicesActions from '../Redux/DevicesRedux'
import {params1} from '../Navigation/OnboardingNavigation'
import Upload from 'react-native-background-upload'
import { Buffer } from 'buffer'
import Config from 'react-native-config'
import { ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'
import DeepLink from '../Services/DeepLink'

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
    yield put(TextileNodeActions.createNodeSuccess())
    yield put(TextileNodeActions.startNodeRequest())
  } catch (error) {
    yield put(TextileNodeActions.createNodeFailure(error))
    yield put(TextileNodeActions.lock(false))
  }
}

export function * startNode () {
  const onboarded = yield select(PreferencesSelectors.onboarded)
  if (!onboarded) {
    yield put(TextileNodeActions.lock(false))
    return
  }
  try {
    yield call(TextileNode.start)
    yield put(TextileNodeActions.startNodeSuccess())
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
  const { threadId } = action.payload
  try {
    const photos: TextileTypes.Photos = yield call(TextileNode.getPhotos, -1, threadId)
    let data: PhotosQueryResult[] = []
    for (let photo of photos.items) {
      const metadata: TextileTypes.PhotoMetadata = yield call(TextileNode.getPhotoMetadata, photo.id)
      data.push({ photo, metadata })
    }
    yield put(TextileNodeActions.getPhotoHashesSuccess(threadId, data))
  } catch (error) {
    yield put(TextileNodeActions.getPhotoHashesFailure(threadId, error))
  }
}

export function * addDevice (action: ActionType<typeof DevicesActions.addDeviceRequest>) {
  const { name, pubKey } = action.payload
  try {
    yield call(TextileNode.addDevice, name, pubKey)
    yield put(DevicesActions.addDeviceSuccess(pubKey))
  } catch (error) {
    yield put(DevicesActions.addDeviceError(pubKey, error))
  }
}

export function * shareImage (action: ActionType<typeof UIActions.sharePhotoRequest>) {
  try {
    const { id, threadIds, caption} = action.payload
    for (const threadId of threadIds) {
      // TODO: Do something with this blockId
      const blockId: string = yield call(TextileNode.sharePhotoToThread, id, threadId, caption)
      yield put(TextileNodeActions.getPhotoHashesRequest(threadId))
    }
  } catch (error) {
    yield put(UIActions.imageSharingError(error))
  }
}

export function * photosTask () {
  try {
    // Make sure we have a default thread
    const threads: TextileTypes.Threads = yield call(TextileNode.threads)
    var defaultThread = threads.items.find(thread => thread.name === 'default')
    if (!defaultThread) {
      defaultThread = yield call(TextileNode.addThread, "default")
    }
    if (!defaultThread) {
      return
    }
    const camera = yield select(TextileSelectors.camera)
    let limit = camera.processed === undefined ? -1 : 250
    let allPhotos = yield call(getAllPhotos, limit)

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
        const addResult: TextileTypes.AddResult = yield call(TextileNode.addPhoto, photo.path)
        // TODO: something with this block id?
        const blockId: string = yield call(TextileNode.addPhotoToThread, addResult.id, addResult.key, defaultThread.id)
        photoUploads.push({
          photo,
          addResult
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
    yield put(TextileNodeActions.getPhotoHashesRequest(defaultThread.id))
    // initialize and complete our uploads
    for (let photoData of photoUploads) {
      let {photo, addResult} = photoData
      try {
        yield put(TextileActions.imageAdded(photo.uri, 'default', addResult.id, addResult.pin_request.payload_path))
        yield uploadFile(addResult.id, addResult.pin_request.boundary, addResult.pin_request.payload_path)
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
    if (item.payloadPath && item.state === 'complete') {
      // TODO: probably should be a try/catch?
      yield call(RNFS.unlink, item.payloadPath)
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
      yield uploadFile(item.hash, item.hash, item.payloadPath)
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
  const { name, mnemonic } = action.payload
  try {
    const thread: TextileTypes.Thread = yield call(TextileNode.addThread, name, mnemonic)
    yield put(ThreadsActions.addThreadSuccess(thread))
    yield put(TextileNodeActions.getPhotoHashesRequest(thread.id))
    yield call(PhotosNavigationService.goBack)
  } catch (error) {
    yield put(ThreadsActions.addThreadError(error))
  }
}

export function * removeThread (action: ActionType<typeof ThreadsActions.removeThreadRequest>) {
  const { id } = action.payload
  try {
    // TODO: something with this blockId
    const blockId: string = yield call(TextileNode.removeThread, id)
    yield put(ThreadsActions.removeThreadSuccess(id))
    yield call(PhotosNavigationService.goBack)
  } catch (error) {
    yield put(ThreadsActions.removeThreadError(error))
  }
}

export function * refreshThreads () {
  try {
    const threads: TextileTypes.Threads = yield call(TextileNode.threads)
    for (const thread of threads.items) {
      yield put(TextileNodeActions.getPhotoHashesRequest(thread.id))
    }
    yield put(ThreadsActions.refreshThreadsSuccess(threads))
  } catch (error) {
    yield put(ThreadsActions.refreshThreadsError(error))
  }
}

export function * addExternalInvite (action: ActionType<typeof ThreadsActions.addExternalInviteRequest>) {
  const { threadId, threadName } = action.payload
  try {
    const invite: TextileTypes.ExternalInvite = yield call(TextileNode.addExternalThreadInvite, threadId)
    yield put(ThreadsActions.addExternalInviteSuccess(threadId, threadName, invite))
  } catch (error) {
    yield put(ThreadsActions.addExternalInviteError(error))
  }
}

export function * presentShareInterface(action: ActionType<typeof ThreadsActions.addExternalInviteSuccess>) {
  const { invite, threadName } = action.payload
  const link = DeepLink.createInviteLink(invite, threadName)
  yield call(Share.share, { title: 'Join my thread on Textile!', message: link })
}

export function * acceptExternalInvite (action: ActionType<typeof ThreadsActions.acceptExternalInviteRequest>) {
  const { inviteId, key } = action.payload
  try {
    const id: string = yield call(TextileNode.acceptExternalThreadInvite, inviteId, key)
    yield put(ThreadsActions.refreshThreadsRequest())
    yield put(ThreadsActions.acceptExternalInviteSuccess(id))
  } catch (error) {
    yield put(ThreadsActions.acceptExternalInviteError(error))
  }
}
