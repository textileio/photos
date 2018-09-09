import { call, put, select } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'
import RNFS from 'react-native-fs'
import Upload from 'react-native-background-upload'

import {PhotoId} from '../Models/TextileTypes'

import ProcessingImagesActions, { ProcessingImage, ProcessingImagesSelectors } from '../Redux/ProcessingImagesRedux'
import UIActions from '../Redux/UIRedux'
import {insertImage, addToIpfs, uploadArchive, shareWalletImage, addToWallet, shareToThread, uploadWalletImage} from './ImageSharingSagas'
import { refreshTokens } from './NodeCreated'
import {StorageSelectors} from "../Redux/StorageRedux";
import StorageActions from "../Redux/StorageRedux";

export function * handleSharePhotoRequest (action: ActionType<typeof UIActions.sharePhotoRequest>) {
  const { image, threadId, comment } = action.payload
  if (!image || !threadId) {
    return
  }
  if (typeof image === 'string') {
    const localPin = yield select(StorageSelectors.pinnedPhoto, image as PhotoId)
    // if pinnedPhoto doesn't exist, it was added through a share, so known to be Remote
    // we can clean this up later by storing a bit of metadata in go for every photo, remote=boolean
    if (localPin) {
      // First, let's distrbute on IPFS
      yield call(uploadWalletImage, localPin, image as PhotoId, threadId, comment)
    } else {
      // Already distributed, so let's fire the Share
      yield call(shareWalletImage, image as PhotoId, threadId, comment)
    }
  } else {
    yield call(insertImage, image, threadId, comment)
  }
}

export function * handleImageUploadComplete (action: ActionType<typeof ProcessingImagesActions.imageUploadComplete>) {
  const { uuid } = action.payload
  yield call(addToWallet, uuid)
  try {
    const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByUuid, uuid)

    // If it was a local pin, mark it as remote now
    if (processingImage && processingImage.addData) {
      yield put(StorageActions.remotePinSuccess(processingImage.addData.addResult))
    }

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
