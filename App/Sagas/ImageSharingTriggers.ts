import { call, put, select } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'
import RNFS from 'react-native-fs'
import { PhotoId } from '../Models/TextileTypes'

import ProcessingImagesActions, { ProcessingImage, ProcessingImagesSelectors } from '../Redux/ProcessingImagesRedux'
import UIActions from '../Redux/UIRedux'
import { insertImage, addToIpfs, uploadArchive, shareWalletImage, addToWallet, shareToThread } from './ImageSharingSagas'

export function * handleSharePhotoRequest (action: ActionType<typeof UIActions.sharePhotoRequest>) {
  const { image, imageId, threadId, comment } = action.payload
  if ((!image && !imageId) || !threadId) {
    return
  }
  if (imageId) {
    yield call(shareWalletImage, imageId, threadId, comment)
  } else if (image) {
    yield call(insertImage, image, threadId, comment)
  }
}

export function * handleImageUploadComplete (action: ActionType<typeof ProcessingImagesActions.imageUploadComplete>) {
  const { uuid } = action.payload
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
  } else if (processingImage.state === 'pending' || processingImage.state ==='adding') {
    yield call(addToIpfs, uuid)
  }
}

export function * cancelImageShare (action: ActionType<typeof ProcessingImagesActions.cancelRequest>) {
  const { uuid } = action.payload
  try {
    const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByUuid, uuid)
    if (!processingImage) {
      return
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
