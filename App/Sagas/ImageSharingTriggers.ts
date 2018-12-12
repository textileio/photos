import { call, put, select } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'
import RNFS from 'react-native-fs'
// @ts-ignore
import Upload from 'react-native-background-upload'

import { SharedImage } from '../Models/TextileTypes'

import ProcessingImagesActions, { ProcessingImage } from '../Redux/ProcessingImagesRedux'
import { allUploadsComplete, processingImageForUploadId, processingImageByUuid } from '../Redux/ProcessingImagesSelectors'
import UIActions from '../Redux/UIRedux'
import {insertImage, prepareImage, uploadPins, shareWalletImage, shareToThread} from './ImageSharingSagas'
import { logNewEvent } from './DeviceLogs'
import { refreshAllSessions } from '../Services/CafeSessions'

export function * handleSharePhotoRequest (action: ActionType<typeof UIActions.sharePhotoRequest>) {
  const { image, threadId, comment } = action.payload
  if (typeof image === 'string' && threadId) {
    yield call(shareWalletImage, image, threadId, comment)
  } else if ((image as SharedImage).path) {
    yield call(insertImage, image as SharedImage, threadId, comment)
  }
}

export function * handleImageUploadComplete (action: ActionType<typeof ProcessingImagesActions.imageUploadComplete>) {
  // TODO: Handle image upload complete with new redux modeling
  const { uploadId } = action.payload
  yield call(logNewEvent, 'uploadComplete', uploadId)
  const processingImage: ProcessingImage | undefined = yield select(processingImageForUploadId, uploadId)
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
    const allComplete: boolean = yield select(allUploadsComplete, processingImage.uuid)
    const alreadySharing = processingImage.status === 'sharing' || processingImage.status === 'complete'
    if (allComplete && !alreadySharing) {
      yield call(shareToThread, processingImage.uuid)
    }
  }
}

export function * retryImageShare (action: ActionType<typeof ProcessingImagesActions.retry>) {
  const { uuid } = action.payload
  yield call(logNewEvent, 'retryImageShare', uuid)
  const processingImage: ProcessingImage | undefined = yield select(processingImageByUuid, uuid)
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

export function * retryWithTokenRefresh (action: ActionType<typeof ProcessingImagesActions.expiredTokenError>) {
  const { uuid } = action.payload
  try {
    yield call(refreshAllSessions)
    yield put(ProcessingImagesActions.retry(uuid))
  } catch (error) {
    // TODO: Should redirect user back to login
    yield put(ProcessingImagesActions.error(uuid, 'Failed refresh tokens'))
  }
}

export function * cancelImageShare (action: ActionType<typeof ProcessingImagesActions.cancelRequest>) {
  const { uuid } = action.payload
  try {
    const processingImage: ProcessingImage | undefined = yield select(processingImageByUuid, uuid)
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
  yield put(ProcessingImagesActions.cancelComplete(uuid))
}

export function * handleImageUploadError (action: ActionType<typeof ProcessingImagesActions.error>) {
  const { error } = action.payload
  let message = 'handleImageUploadError'
  if (typeof error === 'string') {
    message = error
  } else if (error.message) {
    message = error.message
  }
  yield call(logNewEvent, 'Upload Error', message, true)
}
