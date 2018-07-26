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
import UploadingImagesActions, { UploadingImagesSelectors, UploadingImage } from '../Redux/UploadingImagesRedux'
import TextileNodeActions, { TextileNodeSelectors, PhotosQueryResult } from '../Redux/TextileNodeRedux'
import PreferencesActions, { PreferencesSelectors } from '../Redux/PreferencesRedux'
import { ThreadsSelectors } from '../Redux/ThreadsRedux'
import AuthActions, { AuthSelectors } from '../Redux/AuthRedux'
import UIActions from '../Redux/UIRedux'
import ThreadsActions from '../Redux/ThreadsRedux'
import DevicesActions from '../Redux/DevicesRedux'
import {params1} from '../Navigation/OnboardingNavigation'
import Upload from 'react-native-background-upload'
import Config from 'react-native-config'
import { ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'
import * as CameraRoll from '../Services/CameraRoll'
import CameraRollActions, { cameraRollSelectors, QueriedPhotosMap } from '../Redux/CameraRollRedux'
import DeepLink from '../Services/DeepLink'

export function * signUp (action: ActionType<typeof AuthActions.signUpRequest>) {
  const {referralCode, username, email, password} = action.payload.data
  try {
    yield call(TextileNode.signUpWithEmail, email, username, password, referralCode)
    const tokens = yield call(TextileNode.getTokens)
    yield put(AuthActions.getTokensSuccess(tokens))
    // TODO: Put username into textile-go for addition to metadata model
    yield put(AuthActions.signUpSuccess())
    yield call(NavigationService.navigate, 'OnboardingScreen', params1)
  } catch (error) {
    yield put(AuthActions.signUpFailure(error))
  }
}

export function * logIn (action: ActionType<typeof AuthActions.logInRequest>) {
  const {username, password} = action.payload.data
  try {
    yield call(TextileNode.signIn, username, password)
    const tokens = yield call(TextileNode.getTokens)
    yield put(AuthActions.getTokensSuccess(tokens))
    yield put(AuthActions.logInSuccess())
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
    yield call(TextileNode.create, path, Config.TEXTILE_CAFE_URI, logLevel, logFiles)
    yield put(TextileNodeActions.createNodeSuccess())
    try {
      const mnemonic: string = yield call(TextileNode.mnemonic)
      yield put(PreferencesActions.updatecMnemonic(mnemonic))
    } catch(error) {
      // This only succeeds when the node is first created so this error is expected
    }

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

async function getDefaultThread (): Promise<TextileTypes.Thread | undefined> {
  const threads = await TextileNode.threads()
  var defaultThread = threads.items.find(thread => thread.name === 'default')
  return defaultThread
}

export function * pendingInvitesTask () {
  // Process any pending external invites created while user wasn't logged in
  const threads = yield select(ThreadsSelectors.threads)
  if (threads.pendingInviteLink) {
    yield call(DeepLink.route, threads.pendingInviteLink, NavigationService)
    yield put(ThreadsActions.removeExternalInviteLink())
  }
}

export function * photosTask() {
  const queriredPhotosInitialized: boolean = yield select(cameraRollSelectors.initialized)
  if (!queriredPhotosInitialized) {
    yield put(CameraRollActions.updateQuerying(true))
    const uris: string[] = yield call(CameraRoll.getPhotos)
    yield put(CameraRollActions.updateQuerying(false))
    yield put(CameraRollActions.initialzePhotos(uris))
    return
  }

  yield put(CameraRollActions.updateQuerying(true))
  const uris: string[] = yield call(CameraRoll.getPhotos, 250)
  yield put(CameraRollActions.updateQuerying(false))

  const previouslyQueriedPhotos: QueriedPhotosMap = yield select(cameraRollSelectors.queriedPhotos)

  const urisToProcess = uris.filter(uri => !previouslyQueriedPhotos[uri]).reverse()
  put(CameraRollActions.trackPhotos(urisToProcess))

  var defaultThread: TextileTypes.Thread | undefined = yield call(getDefaultThread)
  if (!defaultThread) {
    yield put(ThreadsActions.addThreadRequest('default'))
    yield take(getType(ThreadsActions.addThreadSuccess))
    yield put(ThreadsActions.refreshThreadsRequest())
  }
  defaultThread = yield call(getDefaultThread)
  if (!defaultThread) {
    return
  }

  let addedPhotosData: { uri: string, addResult: TextileTypes.AddResult, blockId: string }[] = []

  for (const uri of urisToProcess) {
    let photoPath = ''
    try {
      photoPath = yield call(CameraRoll.getPhotoPath, uri)
      const addResult: TextileTypes.AddResult = yield call(TextileNode.addPhoto, photoPath)
      const blockId: string = yield call(TextileNode.addPhotoToThread, addResult.id, addResult.key, defaultThread.id)
      if (!addResult.archive) {
        throw new Error('no archive returned')
      }
      yield put(UploadingImagesActions.addImage(addResult.archive.path, addResult.id, 3))
      yield put(TextileNodeActions.getPhotoHashesRequest(defaultThread.id))
      addedPhotosData.push({ uri, addResult, blockId })
    } catch (error) {
      yield put(CameraRollActions.untrackPhoto(uri))
      const exists: boolean = yield call(RNFS.exists, photoPath)
      if (exists) {
        yield call(RNFS.unlink, photoPath)
      }
    }
  }

  for (const addedPhotoData of addedPhotosData) {
    try {
      if (!addedPhotoData.addResult.archive) {
        throw new Error('no archive to upload')
      }
      yield uploadFile(
        addedPhotoData.addResult.id,
        addedPhotoData.addResult.archive.path
      )
    } catch (error) {
      // Leave all the data in place so we can rerty upload
      yield put(UploadingImagesActions.imageUploadError(addedPhotoData.addResult.id, error))
    }
  }

  const appState = yield select(TextileNodeSelectors.appState)
  if (appState.match(/background/)) {
    yield * stopNode()
  }
}

export function * removePayloadFile (action: ActionType<typeof UploadingImagesActions.imageUploadComplete>) {
  const { dataId } = action.payload
  const uploadingImage: UploadingImage = yield select(UploadingImagesSelectors.uploadingImageById, dataId)
  yield call(RNFS.unlink, uploadingImage.path)
  yield put(UploadingImagesActions.imageRemovalComplete(dataId))
}

export function * retryUploadAfterError (action: ActionType<typeof UploadingImagesActions.imageUploadError>) {
  const { dataId } = action.payload
  const uploadingImage: UploadingImage = yield select(UploadingImagesSelectors.uploadingImageById, dataId)
  yield put(UploadingImagesActions.imageUploadRetried(dataId))
  yield uploadFile(uploadingImage.dataId, uploadingImage.path)
}

function * uploadFile (id: string, payloadPath: string) {
  let tokens = yield select(AuthSelectors.tokens)
  if (!tokens) {
    tokens = yield call(TextileNode.getTokens)
    yield put(AuthActions.getTokensSuccess(tokens))
  }
  yield call(
    Upload.startUpload,
    {
      customUploadId: id,
      path: payloadPath,
      url: Config.TEXTILE_CAFE_URI + Config.TEXTILE_CAFE_PIN_PATH,
      method: 'POST',
      type: 'raw',
      headers: {
        'Authorization': 'Bearer ' + tokens.access,
        'Content-Type': 'application/gzip'
      }
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
  const { id, name } = action.payload
  try {
    const invite: TextileTypes.ExternalInvite = yield call(TextileNode.addExternalThreadInvite, id)
    yield put(ThreadsActions.addExternalInviteSuccess(id, name, invite))
  } catch (error) {
    yield put(ThreadsActions.addExternalInviteError(id, error))
  }
}

export function * presentShareInterface(action: ActionType<typeof ThreadsActions.addExternalInviteSuccess>) {
  const { invite, name } = action.payload
  const link = DeepLink.createInviteLink(invite, name)
  yield call(Share.share, { title: 'Join my thread on Textile!', message: link })
}

export function * acceptExternalInvite (action: ActionType<typeof ThreadsActions.acceptExternalInviteRequest>) {
  const { inviteId, key } = action.payload
  try {
    const id: string = yield call(TextileNode.acceptExternalThreadInvite, inviteId, key)
    yield put(ThreadsActions.refreshThreadsRequest())
    yield put(ThreadsActions.acceptExternalInviteSuccess(inviteId, id))
  } catch (error) {
    yield put(ThreadsActions.acceptExternalInviteError(inviteId, error))
  }
}
