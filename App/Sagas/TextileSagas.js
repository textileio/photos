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
import IPFS from '../../TextileIPFSNativeModule'
import {queryPhotos} from '../Services/PhotoUtils'
import {StartupTypes} from '../Redux/StartupRedux'
import TextileActions, { TextileSelectors } from '../Redux/TextileRedux'
import IpfsNodeActions, { IpfsNodeSelectors } from '../Redux/IpfsNodeRedux'
import AuthActions from '../Redux/AuthRedux'
import UIActions from '../Redux/UIRedux'
import {params1} from '../Navigation/OnboardingNavigation'
import Upload from 'react-native-background-upload'
import { Buffer } from 'buffer'
import Config from 'react-native-config'

const API_URL = 'https://api.textile.io'

export function * signUp ({data}) {
  const {referralCode, username, email, password} = data
  try {
    const data = yield call(IPFS.signUp, username, password, email, referralCode)
    const response = JSON.parse(data)
    if (response.error) {
      yield put(AuthActions.signUpFailure(response.error))
    } else {
      // TODO: Put username into textile-go for addition to metadata model
      yield put(AuthActions.signUpSuccess('tokenFromSignUp'))
      yield call(NavigationService.navigate, 'OnboardingScreen', params1)
    }
  } catch (error) {
    yield put(AuthActions.signUpFailure(error))
  }
}

export function * logIn ({data}) {
  const {username, password} = data
  try {
    const data = yield call(IPFS.signIn, username, password)
    const response = JSON.parse(data)
    if (response.error) {
      yield put(AuthActions.signUpFailure(response.error))
    } else {
      yield put(AuthActions.logInSuccess('tokenFormLogIn'))
      yield call(NavigationService.navigate, 'OnboardingScreen', params1)
    }
  } catch (error) {
    yield put(AuthActions.logInFailure(error))
  }
}

export function * recoverPassword ({data}) {
  const {username} = data
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

export function * toggleBackgroundTimer ({value}) {
  if (value) {
    yield call(BackgroundTimer.start)
  } else {
    yield call(BackgroundTimer.stop)
    yield call(BackgroundTask.finish)
  }
}

export function * initializeAppState () {
  yield take(StartupTypes.STARTUP)
  const defaultAppState = yield select(IpfsNodeSelectors.appState)
  let queriedAppState = defaultAppState
  while (queriedAppState.match(/default|unknown/)) {
    yield delay(10)
    const currentAppState = yield call(() => AppState.currentState)
    queriedAppState = currentAppState || 'unknown'
  }
  yield put(IpfsNodeActions.appStateChange(defaultAppState, queriedAppState))
}

export function * handleNewAppState ({previousState, newState}) {
  console.log('handleNewAppState', previousState, newState)
  if (previousState.match(/default|unknown/) && newState === 'background') {
    console.tron.logImportant('launched into background')
    yield * triggerCreateNode()
  } else if (previousState.match(/default|unknown|inactive|background/) && newState === 'active') {
    console.tron.logImportant('app transitioned to foreground')
    yield * triggerCreateNode()
  } else if (previousState.match(/inactive|active/) && newState === 'background') {
    console.tron.logImportant('app transitioned to background')
    yield * triggerStopNode()
  }
}

export function * triggerCreateNode () {
  const locked = yield select(IpfsNodeSelectors.locked)
  if (locked) {
    return
  }
  yield put(IpfsNodeActions.lock(true))
  yield put(IpfsNodeActions.createNodeRequest(RNFS.DocumentDirectoryPath))
}

export function * triggerStopNode () {
  yield put(IpfsNodeActions.stopNodeRequest())
}

export function * createNode ({path}) {
  try {
    const debugLevel = (__DEV__ ? "DEBUG" : "INFO")
    const createNodeSuccess = yield call(IPFS.createNodeWithDataDir, path, API_URL, debugLevel)
    const updateThreadSuccess = yield call(IPFS.updateThread, Config.ALL_THREAD_MNEMONIC, Config.ALL_THREAD_NAME)
    if (createNodeSuccess && updateThreadSuccess) {
      yield put(IpfsNodeActions.createNodeSuccess())
      yield put(IpfsNodeActions.startNodeRequest())
    } else {
      yield put(IpfsNodeActions.createNodeFailure(new Error('Failed creating node, but no error was thrown - Should not happen')))
      yield put(IpfsNodeActions.lock(false))
    }
  } catch (error) {
    yield put(IpfsNodeActions.createNodeFailure(error))
    yield put(IpfsNodeActions.lock(false))
  }
}

export function * startNode () {
  const onboarded = yield select(TextileSelectors.onboarded)
  if (!onboarded) {
    yield put(IpfsNodeActions.lock(false))
    return
  }
  try {
    const startNodeSuccess = yield call(IPFS.startNode)
    if (startNodeSuccess) {
      yield put(IpfsNodeActions.startNodeSuccess())
      yield put(IpfsNodeActions.getPhotoHashesRequest('default'))
      yield put(IpfsNodeActions.getPhotoHashesRequest('all'))
    } else {
      yield put(IpfsNodeActions.startNodeFailure(new Error('Failed starting node, but no error was thrown - Should not happen')))
      yield put(IpfsNodeActions.lock(false))
    }
  } catch (error) {
    yield put(IpfsNodeActions.startNodeFailure(error))
    yield put(IpfsNodeActions.lock(false))
  }
}

export function * stopNode () {
  yield put(IpfsNodeActions.lock(true))
  try {
    yield call(IPFS.stopNode)
    yield put(IpfsNodeActions.stopNodeSuccess())
  } catch (error) {
    yield put(IpfsNodeActions.stopNodeFailure(error))
  } finally {
    yield put(IpfsNodeActions.lock(false))
  }
}

export function * getPhotoHashes ({thread}) {
  try {
    const hashes = yield call(IPFS.getPhotos, null, -1, thread)
    let data = []
    for (const hash of hashes) {
      let item = { hash }
      try {
        const captionsrc = yield call(IPFS.getHashData, hash, '/caption')
        const caption = Buffer.from(captionsrc, 'base64').toString('utf8')
        item = {...item, caption}
      } catch (err) {
        // gracefully return an empty caption for now
      }
      try {
        const metasrc = yield call(IPFS.getHashData, hash, '/meta')
        const meta = JSON.parse(Buffer.from(metasrc, 'base64').toString('utf8'))
        item = {...item, meta}
      } catch (err) {
        // gracefully return an empty meta for now
      }
      data.push({...item})
    }
    yield put(IpfsNodeActions.getPhotoHashesSuccess(thread, data))
  } catch (error) {
    yield put(IpfsNodeActions.getPhotoHashesFailure(thread, error))
  }
}

export function * pairNewDevice (action) {
  const { pubKey } = action
  try {
    yield call(IPFS.pairNewDevice, pubKey)
    yield put(TextileActions.pairNewDeviceSuccess(pubKey))
  } catch (err) {
    yield put(TextileActions.pairNewDeviceError(pubKey))
  }
}

export function * shareImage ({thread, hash, caption}) {
  try {
    const multipartData = yield call(IPFS.sharePhoto, hash, thread, caption)
    yield put(TextileActions.imageAdded(thread, multipartData.boundary, multipartData.payloadPath))
    yield put(IpfsNodeActions.getPhotoHashesRequest(thread))
    yield call(
      Upload.startUpload,
      {
        customUploadId: multipartData.boundary,
        path: multipartData.payloadPath,
        url: 'https://ipfs.textile.io/api/v0/add?wrap-with-directory=true',
        method: 'POST',
        type: 'multipart',
        field: multipartData.boundary
      }
    )
  } catch (error) {
    yield put(UIActions.imageSharingError(error))
  }
}

export function * photosTask () {
  try {
    const camera = yield select(TextileSelectors.camera)
    const processed = camera && camera.processed ? camera.processed : []

    let allPhotos = yield call(queryPhotos)
    if (camera === undefined || camera.processed === undefined) {
      for (const uri of allPhotos.map((p) => p.uri)) {
        yield put(TextileActions.newImage(uri))
      }
      allPhotos = []
    }

    // TODO: add all to processed and quit
    let photos = allPhotos.filter((photo) => {
      return processed.indexOf(photo.uri) === -1
    })

    for (const photo of photos.reverse()) {
      const multipartData = yield call(IPFS.addImageAtPath, photo.path, photo.thumbPath, 'default')
      yield put(TextileActions.newImage(photo.uri))
      yield call(RNFS.unlink, photo.path)
      yield call(RNFS.unlink, photo.thumbPath)
      yield put(TextileActions.imageAdded('default', multipartData.boundary, multipartData.payloadPath))
      yield put(IpfsNodeActions.getPhotoHashesRequest('default'))
      yield call(
        Upload.startUpload,
        {
          customUploadId: multipartData.boundary,
          path: multipartData.payloadPath,
          url: 'https://ipfs.textile.io/api/v0/add?wrap-with-directory=true',
          method: 'POST',
          type: 'multipart',
          field: multipartData.boundary
        }
      )
      console.log(multipartData.payloadPath)
    }
  } catch (error) {
    yield put(TextileActions.photosTaskError(error))
  } finally {
    const appState = yield select(IpfsNodeSelectors.appState)
    if (appState.match(/background/)) {
      yield * stopNode()
    } else {
      yield put(IpfsNodeActions.lock(false))
    }
  }
}

export function * removePayloadFile ({data}) {
  const { id } = data
  const items = yield select(TextileSelectors.itemsById, id)
  for (const item of items) {
    if (item.remotePayloadPath && item.state === 'complete') {
      yield call(RNFS.unlink, item.remotePayloadPath)
    }
  }
  yield put(TextileActions.imageRemovalComplete(id))
}
