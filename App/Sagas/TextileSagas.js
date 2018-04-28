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

import { delay } from 'redux-saga'
import { call, put, all } from 'redux-saga/effects'
import BackgroundTimer from 'react-native-background-timer'
import RNFS from 'react-native-fs'
import BackgroundTask from 'react-native-background-task'
import NavigationService from '../Services/NavigationService'
import IPFS from '../../TextileIPFSNativeModule'
import UploadTask from '../../UploadTaskNativeModule'
import {queryPhotos} from '../Services/PhotoUtils'
import TextileActions from '../Redux/TextileRedux'
import IpfsNodeActions from '../Redux/IpfsNodeRedux'
import AuthActions from '../Redux/AuthRedux'
import {params1} from '../Navigation/OnboardingNavigation'
import Upload from 'react-native-background-upload'

export function * signUp ({data}) {
  const {referralCode, username, email, password} = data
  try {
    yield delay(2000)
    yield put(AuthActions.signUpSuccess('tokenFromSignUp'))
    yield call(NavigationService.navigate, 'OnboardingScreen', params1)
  } catch (error) {
    yield put(AuthActions.signUpFailure(error))
  }
}

export function * logIn ({data}) {
  const {username, password} = data
  try {
    yield delay(2000)
    yield put(AuthActions.logInSuccess('tokenFormLogIn'))
    yield call(NavigationService.navigate, 'OnboardingScreen', params1)
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

export function * createNode ({path}) {
  try {
    const success = yield call(IPFS.createNodeWithDataDir, path)
    if (success) {
      yield put(IpfsNodeActions.createNodeSuccess())
    } else {
      yield put(IpfsNodeActions.createNodeFailure(new Error('Failed creating node, but no error was thrown - Should not happen')))
    }
  } catch (error) {
    yield put(IpfsNodeActions.createNodeFailure(error))
  }
}

export function * startGateway () {
  try {
    const success = yield call(IPFS.startGateway)
    if (success) {
      yield put(IpfsNodeActions.startGatewaySuccess())
    } else {
      yield put(IpfsNodeActions.startGatewayFailure(new Error('Failed starting gateway, but no error was thrown - Should not happen')))
    }
  } catch (error) {
    yield put(IpfsNodeActions.startGatewayFailure(error))
  }
}

export function * startNode () {
  try {
    const success = yield call(IPFS.startNode)
    if (success) {
      yield put(IpfsNodeActions.startNodeSuccess())
    } else {
      yield put(IpfsNodeActions.startNodeFailure(new Error('Failed starting node, but no error was thrown - Should not happen')))
    }
  } catch (error) {
    yield put(IpfsNodeActions.startNodeFailure(error))
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

export function * photosTask (action) {
  const newState = action.newState
  if (newState && newState !== 'active') {
    return
  }
  try {
    yield call(BackgroundTimer.start)
    yield call(IPFS.createNodeWithDataDir, RNFS.DocumentDirectoryPath)
    yield call(IPFS.startNode)
    const photos = yield call(queryPhotos)
    for (const photo of photos) {
      const multipartData = yield call(IPFS.addImageAtPath, photo.node.image.path, photo.node.image.thumbPath, 'default')
      yield call(RNFS.unlink, photo.node.image.path)
      yield call(RNFS.unlink, photo.node.image.thumbPath)
      photo.node.image['hash'] = multipartData.boundary
      yield put(TextileActions.imageAdded(photo, multipartData.payloadPath))
      yield call(
        UploadTask.uploadFile,
        multipartData.payloadPath,
        'https://ipfs.textile.io/api/v0/add?wrap-with-directory=true',
        'POST',
        multipartData.boundary
      )
    }
    yield call(BackgroundTimer.stop)
    yield call(BackgroundTask.finish)
  } catch (error) {
    yield put(TextileActions.photosTaskError(error))
  }
}

export function * removePayloadFile ({data}) {
  const {file} = data
  yield call(RNFS.unlink, file)
}
