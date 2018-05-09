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
import IPFS from '../../TextileIPFSNativeModule'
import {queryPhotos} from '../Services/PhotoUtils'
import TextileActions, { TextileSelectors } from '../Redux/TextileRedux'
import IpfsNodeActions from '../Redux/IpfsNodeRedux'
import AuthActions from '../Redux/AuthRedux'
import UIActions from '../Redux/UIRedux'
import {params1} from '../Navigation/OnboardingNavigation'
import Upload from 'react-native-background-upload'
import CookieManager from 'react-native-cookies'

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

export function * triggerStartNode () {
  yield put(IpfsNodeActions.startNodeRequest(RNFS.DocumentDirectoryPath))
}

export function * triggerStopNode () {
  yield put(IpfsNodeActions.stopNodeRequest())
}

export function * handleStateChange ({newState}) {
  yield call(BackgroundTimer.start)
  if (newState === 'active') {
    yield * triggerStartNode()
  } else if (newState === 'inactive') {
    yield * triggerStopNode()
  }
  yield call(BackgroundTimer.stop)
}

export function * startNode ({path}) {
  // const onboarded = yield select(TextileSelectors.onboarded)
  // if (!onboarded) {
  //   return
  // }
  yield call(BackgroundTimer.start)
  try {
    const createNodeSuccess = yield call(IPFS.createNodeWithDataDir, path, API_URL)
    if (createNodeSuccess) {
      const startNodeSuccess = yield call(IPFS.startNode)
      if (startNodeSuccess) {
        const value = yield call(IPFS.getGatewayPassword)
        if (Platform.OS === 'android') {
          yield call(
            CookieManager.setFromResponse,
            'https://localhost:9080',
            'SessionId=' + value + '; path=/; expires=Thu, 1 Jan 2030 00:00:00 -0000; secure; HttpOnly'
          )
        } else {
          yield call(
            CookieManager.set, {
              name: 'SessionId',
              value: value || 'null',
              origin: 'https://localhost:9080',
              domain: '.localhost',
              version: '1',
              path: '/',
              expiration: '2030-01-01T00:00:00.00-00:00'
            })
        }
        yield put(IpfsNodeActions.startNodeSuccess())
        yield put(IpfsNodeActions.getPhotoHashesRequest('default'))
        yield put(IpfsNodeActions.getPhotoHashesRequest('beta'))
      } else {
        yield put(IpfsNodeActions.startNodeFailure(new Error('Failed starting node, but no error was thrown - Should not happen')))
      }
    } else {
      yield put(IpfsNodeActions.startNodeFailure(new Error('Failed creating node, but no error was thrown - Should not happen')))
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
    const photoData = yield call(IPFS.getPhotos, null, -1, thread)
    yield put(IpfsNodeActions.getPhotoHashesSuccess(thread, photoData))
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

export function * shareImage ({thread, hash}) {
  try {
    const multipartData = yield call(IPFS.sharePhoto, hash, thread)
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
    for (const photo of photos) {
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
