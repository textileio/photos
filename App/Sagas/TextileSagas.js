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
import { Platform } from 'react-native'
import { delay } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import BackgroundTimer from 'react-native-background-timer'
import RNFS from 'react-native-fs'
import BackgroundTask from 'react-native-background-task'
import NavigationService from '../Services/NavigationService'
import PhotosNavigationService from '../Services/PhotosNavigationService'
import IPFS from '../../TextileIPFSNativeModule'
import {queryPhotos} from '../Services/PhotoUtils'
import TextileActions, { TextileSelectors } from '../Redux/TextileRedux'
import IpfsNodeActions from '../Redux/IpfsNodeRedux'
import AuthActions from '../Redux/AuthRedux'
import UIActions from '../Redux/UIRedux'
import {params1} from '../Navigation/OnboardingNavigation'
import Upload from 'react-native-background-upload'
import { Buffer } from 'buffer'

const API_URL = "https://api.textile.io"

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

export function * triggerCreateNode () {
  yield put(IpfsNodeActions.createNodeRequest(RNFS.DocumentDirectoryPath))
}

export function * triggerStopNode () {
  yield put(IpfsNodeActions.stopNodeRequest())
}

export function * handleStateChange ({newState}) {
  yield call(BackgroundTimer.start)
  if (newState === 'active') {
    yield * triggerCreateNode()
  } else if (newState === 'inactive') {
    yield * triggerStopNode()
  }
  yield call(BackgroundTimer.stop)
}

export function * createNode ({path}) {
  yield call(BackgroundTimer.start)
  try {
    const debugLevel = (__DEV__ ? "DEBUG" : "INFO")
    const createNodeSuccess = yield call(IPFS.createNodeWithDataDir, path, API_URL, debugLevel)
    if (createNodeSuccess) {
      yield put(IpfsNodeActions.createNodeSuccess())
      yield put(IpfsNodeActions.startNodeRequest())
    } else {
      yield put(IpfsNodeActions.createNodeFailure(new Error('Failed creating node, but no error was thrown - Should not happen')))
    }
  } catch (error) {
    yield put(IpfsNodeActions.createNodeFailure(error))
  } finally {
    yield call(BackgroundTimer.stop)
  }
}

export function * startNode () {
  const onboarded = yield select(TextileSelectors.onboarded)
  if (!onboarded) {
    return
  }
  yield call(BackgroundTimer.start)
  try {
    const startNodeSuccess = yield call(IPFS.startNode)
    if (startNodeSuccess) {
      yield put(IpfsNodeActions.startNodeSuccess())
      yield put(IpfsNodeActions.getPhotoHashesRequest('default'))
      yield put(IpfsNodeActions.getPhotoHashesRequest('beta'))
    } else {
      yield put(IpfsNodeActions.startNodeFailure(new Error('Failed starting node, but no error was thrown - Should not happen')))
    }
  } catch (error) {
    yield put(IpfsNodeActions.startNodeFailure(error))
  } finally {
    yield call(BackgroundTimer.stop)
  }
}

export function * stopNode () {
  yield call(BackgroundTimer.start)
  try {
    yield call(IPFS.stopNode)
    yield put(IpfsNodeActions.stopNodeSuccess())
  } catch (error) {
    yield put(IpfsNodeActions.stopNodeFailure(error))
  } finally {
    yield call(BackgroundTimer.stop)
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
      data.push(item)
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
    yield call(BackgroundTimer.start)
    const photos = yield call(queryPhotos)
    for (const photo of photos.reverse()) {
      const multipartData = yield call(IPFS.addImageAtPath, photo.path, photo.thumbPath, 'default')
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
    yield call(BackgroundTimer.stop)
    yield call(BackgroundTask.finish)
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
