import { call, put, select } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'
import RNFS from 'react-native-fs'

import ProcessingImagesActions, { ProcessingImage, ProcessingImagesSelectors } from '../Redux/ProcessingImagesRedux'
import UIActions from '../Redux/UIRedux'
import { insertImage, addToIpfs, uploadFromAddResult, shareWalletImage, addToWallet, shareToThread } from './ImageSharingSagas'

export function * handleSharePhotoRequest(action: ActionType<typeof UIActions.sharePhotoRequest>) {
  const { image, threadId, comment } = action.payload
  if (!image || !threadId) {
    return
  }
  if (typeof image === 'string') {
    yield call(shareWalletImage, image, threadId, comment)
  } else {
    yield call(insertImage, image, threadId, comment)
  }
}

export function * handleImageUploadComplete (action: ActionType<typeof ProcessingImagesActions.imageUploadComplete>) {
  const { dataId } = action.payload
  const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByAddResultId, dataId)
  if (!processingImage) {
    return
  }
  yield call(addToWallet, processingImage)
  try {
    if (!processingImage.addData || !processingImage.addData.addResult.archive) {
      return
    }
    const payloadPath = processingImage.addData.addResult.archive.path
    const exists: boolean = yield call(RNFS.exists, payloadPath)
    if (exists) {
      yield call(RNFS.unlink, payloadPath)
    }
  } catch (e) {}
}

export function * retryImageShare (action: ActionType<typeof ProcessingImagesActions.retry>) {
  const { dataId } = action.payload
  const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByAddResultId, dataId)
  if (!processingImage) {
    return
  }
  if (processingImage.state === 'addedToWallet' || processingImage.state === 'sharing') {
    yield call(shareToThread, processingImage)
  } else if (processingImage.state === 'uploaded' || processingImage.state === 'addingToWallet') {
    yield call(addToWallet, processingImage)
  } else if (processingImage.state === 'added' || processingImage.state === 'uploading') {
    if (processingImage.addData) {
      yield call(uploadFromAddResult, processingImage.addData.addResult)
    }
  } else if (processingImage.state === 'pending' || processingImage.state ==='adding') {
    yield call(addToIpfs, processingImage.sharedImage, processingImage.destinationThreadId, processingImage.comment)
  }
}

export function * cancelImageShare (action: ActionType<typeof ProcessingImagesActions.cancelRequest>) {
  const { dataId } = action.payload
  // TODO: Implement cancel logic, it's currently just being deleted in the reducer
  yield put(ProcessingImagesActions.cancelComplete(dataId))
}
