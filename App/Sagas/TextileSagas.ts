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
import { Share, PermissionsAndroid, Platform } from 'react-native'
import { call, put, select } from 'redux-saga/effects'
import RNFS from 'react-native-fs'
import Config from 'react-native-config'
import Textile, { ILogLevel, LogLevel } from '@textile/react-native-sdk'

import { cameraPermissionsTrigger } from '../Services/CameraRoll'
import NavigationService from '../Services/NavigationService'
import * as NotificationsSagas from './NotificationsSagas'
import PreferencesActions, {
  PreferencesSelectors
} from '../Redux/PreferencesRedux'
import UIActions, { UISelectors } from '../Redux/UIRedux'
import { ActionType } from 'typesafe-actions'
import PhotoViewingActions, { ThreadData } from '../Redux/PhotoViewingRedux'
import { logNewEvent } from './DeviceLogs'

export function* navigateToThread(
  action: ActionType<typeof UIActions.navigateToThreadRequest>
) {
  yield put(PhotoViewingActions.viewThread(action.payload.threadId))
  yield call(NavigationService.navigate, 'ViewThread', {
    threadId: action.payload.threadId
  })
}

export function* navigateToComments(
  action: ActionType<typeof UIActions.navigateToCommentsRequest>
) {
  const { photoId, threadId } = action.payload
  if (threadId) {
    // Required to navigate to a thread photo's comments from the all threads screen
    yield put(PhotoViewingActions.viewThread(threadId))
  }
  yield put(PhotoViewingActions.viewPhoto(photoId))
  yield call(NavigationService.navigate, 'Comments')
}

export function* navigateToLikes(
  action: ActionType<typeof UIActions.navigateToLikesRequest>
) {
  const { photoId, threadId } = action.payload
  if (threadId) {
    // Required to navigate to a thread photo's likes from the all threads screen
    yield put(PhotoViewingActions.viewThread(threadId))
  }
  yield put(PhotoViewingActions.viewPhoto(photoId))
  yield call(NavigationService.navigate, 'LikesScreen')
}

export function* presentPublicLinkInterface(
  action: ActionType<typeof UIActions.shareByLink>
) {
  const { path } = action.payload
  try {
    const link = Config.RN_TEXTILE_GATEWAY_URL + '/ipfs/' + path
    yield call(Share.share, { title: '', message: link })
  } catch (error) {
    yield call(logNewEvent, 'refreshMessages', error.message, true)
  }
}

export function* backgroundLocationPermissionsTrigger() {
  if (Platform.OS === 'android') {
    yield call(
      PermissionsAndroid.request,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Please',
        message:
          'Background location allows Textile to wake up periodically to check for updates to your camera roll and to check for updates on your peer-to-peer network.',
        buttonPositive: 'Ok'
      }
    )
  } else {
    yield call(navigator.geolocation.requestAuthorization)
  }
}

export function* handleToggleVerboseUi(
  action: ActionType<typeof PreferencesActions.toggleVerboseUi>
) {
  try {
    const verbose: boolean = yield select(PreferencesSelectors.verboseUi)
    const level = verbose ? LogLevel.Level.DEBUG : LogLevel.Level.ERROR
    const logLevel: ILogLevel = {
      systems: {
        'tex-broadcast': level,
        'tex-core': level,
        'tex-datastore': level,
        'tex-ipfs': level,
        'tex-mill': level,
        'tex-repo': level,
        'tex-service': level
      }
    }
    yield call(Textile.logs.setLevel, logLevel)
  } catch (error) {
    // @todo: nothing for now
  }
}

export function* updateServices(
  action: ActionType<typeof PreferencesActions.toggleServicesRequest>
) {
  const { name } = action.payload
  let currentStatus = action.payload.status
  if (!currentStatus) {
    const service = yield select(PreferencesSelectors.service, name)
    currentStatus = !service ? false : service.status
  }
  if (name === 'backgroundLocation' && currentStatus === true) {
    yield* backgroundLocationPermissionsTrigger()
  } else if (name === 'notifications' && currentStatus === true) {
    yield call(NotificationsSagas.enable)
  }
}

export function* triggerCameraRollPermission() {
  yield call(cameraPermissionsTrigger)
}

export function* addPhotoLike(
  action: ActionType<typeof UIActions.addLike.request>
) {
  const { blockId } = action.payload
  try {
    const likingPhotos = yield select(UISelectors.likingPhotos)
    // If photos is already being liked, don't let the user like it again
    if (Object.keys(likingPhotos).indexOf(blockId) === -1) {
      yield call(Textile.likes.add, blockId)
      yield put(UIActions.addLike.success({ blockId }))
    }
  } catch (error) {
    yield put(UIActions.addLike.failure({ blockId, error: error.message }))
    yield call(logNewEvent, 'addPhotoLike', error.message, true)
  }
}
