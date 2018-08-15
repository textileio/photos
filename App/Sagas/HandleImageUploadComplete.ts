import { call, put, select } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'
import RNFS from 'react-native-fs'

import TextileNode from '../../TextileNode'
import ProcessingImagesActions, { ProcessingImagesSelectors, ProcessingImage } from '../Redux/ProcessingImagesRedux'
import getDefaultThread from './GetDefaultThread'
import { Thread } from '../Models/TextileTypes'

export function * handleImageUploadComplete (action: ActionType<typeof ProcessingImagesActions.imageUploadComplete>) {
  const { dataId } = action.payload
  const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByAddResultId, dataId)
  if (!processingImage || !processingImage.addData || !processingImage.addData.addResult.archive) {
    return
  }
  try {
    yield put(ProcessingImagesActions.addingToWallet(dataId))
    const { id, key } = processingImage.addData.addResult
    const { destinationThreadId, comment } = processingImage
    const defaultThread: Thread = yield * getDefaultThread()
    yield call(TextileNode.addPhotoToThread, id, key, defaultThread.id)
    yield put(ProcessingImagesActions.sharingToThread(id))
    yield call(TextileNode.sharePhotoToThread, id, destinationThreadId, comment)
    yield put(ProcessingImagesActions.complete(id))
    // TODO: Refresh photos hashes for this thread???
    // Seems to be happening already, not sure where
  } catch (error) {
    yield put(ProcessingImagesActions.sharingError(dataId, error))
  } finally {
    try {
      const payloadPath = processingImage.addData.addResult.archive.path
      const exists: boolean = yield call(RNFS.exists, payloadPath)
      if (exists) {
        yield call(RNFS.unlink, payloadPath)
      }
    } catch (e) {}
  }
}