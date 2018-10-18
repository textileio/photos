import { call, put, select } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'
import RNFS from 'react-native-fs'
// @ts-ignore
import Upload from 'react-native-background-upload'

import { PhotoId, SharedImage } from '../Models/TextileTypes'

import ProcessingImagesActions, { ProcessingImage, ProcessingImagesSelectors } from '../Redux/ProcessingImagesRedux'
import UIActions from '../Redux/UIRedux'
import {insertImage, addToIpfs, uploadArchive, shareWalletImage, addToWallet, shareToThread} from './ImageSharingSagas'
import { refreshTokens } from './NodeCreated'
import { logNewEvent } from './DeviceLogs'

export function * handleSharePhotoRequest (action: ActionType<typeof UIActions.sharePhotoRequest>) {
  const { image, threadId, comment } = action.payload
  if (typeof image === 'string' && threadId) {
    yield call(shareWalletImage, image as PhotoId, threadId, comment)
  } else if ((image as SharedImage).path) {
      yield call(insertImage, image as SharedImage, threadId, comment)
  }
}

export function * handleImageUploadComplete (action: ActionType<typeof ProcessingImagesActions.imageUploadComplete>) {
  const { uuid } = action.payload
  yield call(logNewEvent, 'uploadComplete', uuid)
  yield call(addToWallet, uuid)
  try {
    const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByUuid, uuid)
    if (processingImage && processingImage.addData && processingImage.addData.addResult.archive) {
      const exists: boolean = yield call(RNFS.exists, processingImage.addData.addResult.archive.path)
      if (exists) {
        yield call(RNFS.unlink, processingImage.addData.addResult.archive.path)
      }
    }
  } catch (e) {}
}

export function * retryImageShare (action: ActionType<typeof ProcessingImagesActions.retry>) {
  const { uuid } = action.payload
  yield call(logNewEvent, 'retryImageShare', uuid)
  const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByUuid, uuid)
  if (!processingImage) {
    return
  }
  if (processingImage.state === 'addedToWallet' || processingImage.state === 'sharing') {
    yield call(shareToThread, uuid)
  } else if (processingImage.state === 'uploaded' || processingImage.state === 'addingToWallet') {
    yield call(addToWallet, uuid)
  } else if (processingImage.state === 'added' || processingImage.state === 'uploading') {
    yield call(uploadArchive, uuid)
  } else if (processingImage.state === 'pending' || processingImage.state === 'adding') {
    yield call(addToIpfs, uuid)
  }
}

export function * retryWithTokenRefresh (action: ActionType<typeof ProcessingImagesActions.expiredTokenError>) {
  const { uuid } = action.payload
  try {
    yield call(refreshTokens, true)
    yield put(ProcessingImagesActions.retry(uuid))
  } catch (error) {
    // TODO: Should redirect user back to login
    yield put(ProcessingImagesActions.error(uuid, 'Failed refresh tokens'))
  }
}

export function * cancelImageShare (action: ActionType<typeof ProcessingImagesActions.cancelRequest>) {
  const { uuid } = action.payload
  try {
    const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByUuid, uuid)
    if (!processingImage) {
      return
    }

    if (processingImage.state === 'uploading') {
      yield call(Upload.cancelUpload, processingImage.uuid)
    }

    // Delete the shared image if needed
    const exists: boolean = yield call(RNFS.exists, processingImage.sharedImage.path)
    if (exists && processingImage.sharedImage.canDelete) {
      yield call(RNFS.unlink, processingImage.sharedImage.path)
    }

    // Delete the Textile payload
    if (processingImage.addData && processingImage.addData.addResult.archive) {
      const exists: boolean = yield call(RNFS.exists, processingImage.addData.addResult.archive.path)
      if (exists) {
        yield call(RNFS.unlink, processingImage.addData.addResult.archive.path)
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
