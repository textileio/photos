import { call, put, select, fork, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import RNFS from 'react-native-fs'
import Upload from 'react-native-background-upload'

import { SharedImage } from '../features/group/add-photo/models'

import { groupActions, groupSelectors } from '../features/group'
import { ProcessingImage } from '../features/group/add-photo/models'
import AccountActions from '../Redux/AccountRedux'
import UIActions from '../Redux/UIRedux'
import { insertImage, prepareImage, uploadPins, monitorForUploadsComplete, shareWalletImage, shareToThread } from './ImageSharingSagas'
import { logNewEvent } from './DeviceLogs'
import { RootState } from '../Redux/Types'

export function * handleSharePhotoRequest (action: ActionType<typeof UIActions.sharePhotoRequest>) {
  const { image, threadId, comment } = action.payload
  if (typeof image === 'string' && threadId) {
    yield call(shareWalletImage, image, threadId, comment)
  } else if ((image as SharedImage).path) {
    yield call(insertImage, image as SharedImage, threadId, comment)
  }
}

export function * handleImageUploadComplete (action: ActionType<typeof groupActions.addPhoto.imageUploadComplete>) {
  // This saga just listens for complete uploads and deletes the source file
  // ImageSharingSagas.monitorForUploadsComplete is what triggers the next step once all uploads are complete
  const { uploadId } = action.payload
  yield call(logNewEvent, 'uploadComplete', uploadId)
  const selector = (state: RootState, uploadId: string) => groupSelectors.addPhotoSelectors.processingImageForUploadId(state.group.addPhoto, uploadId)
  const processingImage: ProcessingImage | undefined = yield select(selector, uploadId)
  if (processingImage) {
    try {
      if (processingImage.uploadData) {
        const path = processingImage.uploadData[uploadId].path
        const exists: boolean = yield call(RNFS.exists, path)
        if (exists) {
          yield call(RNFS.unlink, path)
        }
      }
    } catch (e) {}
  }
}

export function * startMonitoringExistingUploads () {
  const uploadingImages: ReadonlyArray<ProcessingImage> = yield select((state: RootState) => groupSelectors.addPhotoSelectors.allUploadingImages(state.group.addPhoto))
  for (const uploadingImage of uploadingImages) {
    yield fork(monitorForUploadsComplete, uploadingImage.uuid)
  }
}

export function * retryImageShare (action: ActionType<typeof groupActions.addPhoto.retry>) {
  const { uuid } = action.payload
  yield call(logNewEvent, 'retryImageShare', uuid)
  const selector = (state: RootState) => groupSelectors.addPhotoSelectors.processingImageByUuidFactory(state.group.addPhoto, uuid)(state.group.addPhoto)
  const processingImage: ProcessingImage | undefined = yield select(selector, uuid)
  if (!processingImage) {
    return
  }
  if (processingImage.status === 'sharing') {
    yield call(shareToThread, uuid)
  } else if (processingImage.status === 'uploading') {
    yield call(uploadPins, uuid)
  } else if (processingImage.status === 'preparing') {
    yield call(prepareImage, uuid)
  }
}

export function * retryWithTokenRefresh (action: ActionType<typeof groupActions.addPhoto.error>) {
  if (action.payload.error.type !== 'expiredToken') {
    return
  }
  const { uuid } = action.payload.error
  try {
    yield put(AccountActions.refreshCafeSessionsRequest())
    yield take(getType(AccountActions.cafeSessionsSuccess))
    yield put(groupActions.addPhoto.retry(uuid))
  } catch (error) {
    yield put(groupActions.addPhoto.error({ uuid, underlyingError: 'unable to refresh tokens', type: 'general' }))
  }
}

export function * cancelImageShare (action: ActionType<typeof groupActions.addPhoto.cancelRequest>) {
  const { uuid } = action.payload
  try {
    const selector = (state: RootState) => groupSelectors.addPhotoSelectors.processingImageByUuidFactory(state.group.addPhoto, uuid)(state.group.addPhoto)
    const processingImage: ProcessingImage | undefined = yield select(selector, uuid)
    if (!processingImage) {
      return
    }

    // Delete the shared image if needed
    const exists: boolean = yield call(RNFS.exists, processingImage.sharedImage.path)
    if (exists && processingImage.sharedImage.canDelete) {
      yield call(RNFS.unlink, processingImage.sharedImage.path)
    }

    // Cancel any uploads and delete the Textile payload
    const { uploadData } = processingImage
    if (uploadData) {
      for (const uploadId in uploadData) {
        if (uploadData[uploadId]) {
          yield call(Upload.cancelUpload, uploadId)
          const exists: boolean = yield call(RNFS.exists, uploadData[uploadId].path)
          if (exists) {
            yield call(RNFS.unlink, uploadData[uploadId].path)
          }
        }
      }
    }

    // What else? Undo local add, remote pin, remove from wallet?

  } catch (e) {}
  yield put(groupActions.addPhoto.cancelComplete(uuid))
}

export function * handleImageProcessingError (action: ActionType<typeof groupActions.addPhoto.error>) {
  const { underlyingError } = action.payload.error
  const message = underlyingError.message as string || underlyingError as string || 'handleImageProcessingError'
  yield call(logNewEvent, 'Image Processing Error', message, true)
}
