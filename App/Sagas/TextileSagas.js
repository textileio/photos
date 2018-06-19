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
import TextileNode from '../../TextileNodeNativeModule'
import { getAllPhotos, getPhotoPath } from '../Services/PhotoUtils'
import {StartupTypes} from '../Redux/StartupRedux'
import TextileActions, { TextileSelectors } from '../Redux/TextileRedux'
import TextileNodeActions, { TextileNodeSelectors } from '../Redux/TextileNodeRedux'
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
    const data = yield call(TextileNode.signUpWithEmail, username, password, email, referralCode)
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
    const data = yield call(TextileNode.signIn, username, password)
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
  // TODO: const {username} = data
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
  const defaultAppState = yield select(TextileNodeSelectors.appState)
  let queriedAppState = defaultAppState
  while (queriedAppState.match(/default|unknown/)) {
    yield delay(10)
    const currentAppState = yield call(() => AppState.currentState)
    queriedAppState = currentAppState || 'unknown'
  }
  yield put(TextileNodeActions.appStateChange(defaultAppState, queriedAppState))
}

export function * handleNewAppState ({previousState, newState}) {
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

export function * createNode ({path}) {
  try {
    const logLevel = (__DEV__ ? 'DEBUG' : 'INFO')
    const logFiles = !__DEV__
    const createNodeSuccess = yield call(TextileNode.create, path, API_URL, logLevel, logFiles)
    const addThreadSuccess = yield call(TextileNode.addThread, Config.ALL_THREAD_NAME, Config.ALL_THREAD_MNEMONIC)
    if (createNodeSuccess && addThreadSuccess) {
      yield put(TextileNodeActions.createNodeSuccess())
      yield put(TextileNodeActions.startNodeRequest())
    } else {
      yield put(TextileNodeActions.createNodeFailure(new Error('Failed creating node, but no error was thrown - Should not happen')))
      yield put(TextileNodeActions.lock(false))
    }
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
    const startNodeSuccess = yield call(TextileNode.start)
    if (startNodeSuccess) {
      yield put(TextileNodeActions.startNodeSuccess())
      yield put(TextileNodeActions.getPhotoBlocksRequest('default'))
      yield put(TextileNodeActions.getPhotoBlocksRequest('all'))
    } else {
      yield put(TextileNodeActions.startNodeFailure(new Error('Failed starting node, but no error was thrown - Should not happen')))
      yield put(TextileNodeActions.lock(false))
    }
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

export function * getPhotoBlocks ({thread}) {
  try {
    const items = yield call(TextileNode.getPhotos, null, -1, thread)
    let data = []
    for (let item of items) {
      try {
        const captionsrc = yield call(TextileNode.getFileBase64, item.target + '/caption', item.id)
        const caption = Buffer.from(captionsrc, 'base64').toString('utf8')
        item = {...item, caption}
      } catch (err) {
        // gracefully return an empty caption for now
      }
      try {
        const metasrc = yield call(TextileNode.getFileBase64, item.target + '/meta', item.id)
        const meta = JSON.parse(Buffer.from(metasrc, 'base64').toString('utf8'))
        item = {...item, meta}
      } catch (err) {
        // gracefully return an empty meta for now
      }
      data.push({...item})
    }
    yield put(TextileNodeActions.getPhotoBlocksSuccess(thread, data))
  } catch (error) {
    yield put(TextileNodeActions.getPhotoBlocksFailure(thread, error))
  }
}

export function * pairDevice (action) {
  const { pubKey } = action
  try {
    yield call(TextileNode.pairDevice, pubKey)
    yield put(TextileActions.pairDeviceSuccess(pubKey))
  } catch (err) {
    yield put(TextileActions.pairDeviceError(pubKey))
  }
}

export function * shareImage ({thread, hash, caption}) {
  try {
    yield call(TextileNode.sharePhoto, hash, thread, caption)
    yield put(TextileNodeActions.getPhotoBlocksRequest(thread))
  } catch (error) {
    yield put(UIActions.imageSharingError(error))
  }
}

export function * photosTask () {
  try {
    const camera = yield select(TextileSelectors.camera)
    let allPhotos = yield call(getAllPhotos)

    // If camera.processed didn't exist, we'll add all but 1 photo to our
    // ignore list and then set camera.processed through urisToIgnore
    if (camera === undefined) {
      // case for existing users on the platform. hack-migration
      yield put(TextileActions.urisToIgnore(allPhotos.map(photo => photo.uri)))
      allPhotos = []
    } else if (camera.processed === undefined) {
      const ignoredPhotos = allPhotos.splice(1)
      yield put(TextileActions.urisToIgnore(ignoredPhotos.map(photo => photo.uri)))
    }

    const processed = camera && camera.processed ? camera.processed : []
    let allProcessed = processed.reduce((o, item, index) => ({...o, [item]: { index }}), {})
    const photos = allPhotos.filter((photo) => {
      if (allProcessed[photo.uri]) {
        return false
      }
      return true
    })


    let photoUploads = []
    // Convert all our new entries to thumbs before anything else
    for (let photo of photos.reverse()) {
      try {
        photo = yield call(getPhotoPath, photo)
        const multipartData = yield call(TextileNode.addPhoto, photo.path, 'default', '')
        photoUploads.push({
          photo: photo,
          multipartData
        })
      } catch (error) {
        // if error, delete the photo copy from disk then fire error
        try {
          yield call(RNFS.unlink, photo.path)
        } finally {
          yield put(TextileActions.photoProcessingError(photo.uri, error))
        }
      }
    }

    // refresh our gallery
    yield put(TextileNodeActions.getPhotoBlocksRequest('default'))

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
