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
import Textile, { IThread } from '@textile/react-native-sdk'
import NavigationService from '../Services/NavigationService'
import * as NotificationsSagas from './NotificationsSagas'
import UploadingImagesActions, {
  UploadingImagesSelectors,
  UploadingImage
} from '../Redux/UploadingImagesRedux'
import PreferencesActions, {
  PreferencesSelectors
} from '../Redux/PreferencesRedux'
import UIActions from '../Redux/UIRedux'
import { ActionType } from 'typesafe-actions'
import * as CameraRoll from '../Services/CameraRoll'
import Upload from 'react-native-background-upload'
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

export function* synchronizeNativeUploads() {
  try {
    // THIS COULD potentiall lead to some edge cases where we receive two Error messages
    // back to back... one from here and one later from the Native layer. We should check
    // what is up if that occurs.
    // Grab all the upload Ids from the native layer
    const nativeUploads = yield call(Upload.activeUploads)
    // Grab all the upload Ids from the react native layer
    const reactUploads: string[] = yield select(
      UploadingImagesSelectors.uploadingImageIds
    )
    // Check that each upload ID from the react layer exists in the array from the native layer
    // If not, register an image upload error so a retry can happen if necessary
    for (const uploadId of reactUploads) {
      if (!nativeUploads.includes(uploadId)) {
        // Register the error with a normal image action upload error
        yield put(
          UploadingImagesActions.imageUploadError(
            uploadId,
            'Upload not found in native upload queue.'
          )
        )
      }
    }
  } catch (error) {
    yield put(UploadingImagesActions.synchronizeNativeUploadsError(error))
  }
}

export function* removePayloadFile(
  action: ActionType<typeof UploadingImagesActions.imageUploadComplete>
) {
  // TODO: Seeing an error here where the file is sometimes not found on disk...
  const { dataId } = action.payload
  const uploadingImage: UploadingImage = yield select(
    UploadingImagesSelectors.uploadingImageById,
    dataId
  )
  try {
    // Putting this into a try, because although it might be nice to have the
    // error bubble up, we want to be sure we mark the image as uploaded
    yield call(RNFS.unlink, uploadingImage.path)
  } finally {
    yield put(UploadingImagesActions.imageRemovalComplete(dataId))
  }
}

export function* handleUploadError(
  action: ActionType<typeof UploadingImagesActions.imageUploadError>
) {
  const { dataId } = action.payload
  const uploadingImage: UploadingImage = yield select(
    UploadingImagesSelectors.uploadingImageById,
    dataId
  )
  // If there are no more upload attempts, delete the payload file to free up disk space
  if (uploadingImage.remainingUploadAttempts === 0) {
    try {
      yield call(RNFS.unlink, uploadingImage.path)
    } catch (error) {
      yield call(logNewEvent, 'handleUploadError', error.message, true)
    }
    // Commenting this out for now so we can always see the last error that happend,
    // even though we're not going to retry the upload again.
    // yield put(UploadingImagesActions.imageRemovalComplete(dataId))
  }
}

export function* presentPublicLinkInterface(
  action: ActionType<typeof UIActions.shareByLink>
) {
  const { path } = action.payload
  try {
    const link = Config.RN_TEXTILE_CAFE_GATEWAY_URL + '/ipfs/' + path
    yield call(Share.share, { title: '', message: link })
  } catch (error) {
    yield call(logNewEvent, 'refreshMessages', error.message, true)
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

export function* cameraPermissionsTrigger() {
  // Will trigger a camera permission request
  if (Platform.OS === 'android') {
    const permission = yield call(
      PermissionsAndroid.request,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Textile Photos Photos Permission',
        message:
          'Textile accesses your photo storage to import any new photos you take after you install the app.',
        buttonPositive: 'Ok'
      }
    )
  } else {
    CameraRoll.getPhotos(1)
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

export function* addPhotoLike(
  action: ActionType<typeof UIActions.addLikeRequest>
) {
  const { blockId } = action.payload
  try {
    yield call(Textile.likes.add, blockId)
  } catch (error) {
    yield call(logNewEvent, 'addPhotoLike', error.message, true)
  }
}
