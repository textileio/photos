import { call, put } from 'redux-saga/effects'
import RNFS from 'react-native-fs'

import { uploadFile } from './UploadFile'
import getDefaultThread from './GetDefaultThread'
import TextileNode from '../../TextileNode'
import { SharedImage, AddResult, Thread } from '../Models/TextileTypes'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import ProcessingImagesActions, { ProcessingImage } from '../Redux/ProcessingImagesRedux'
import UIActions from '../Redux/UIRedux'

export function * shareWalletImage (id: string, threadId: string, comment?: string) {
  try {
    // TODO: Insert some state into the processing photos redux in case this takes long or fails
    const blockId: string = yield call(TextileNode.sharePhotoToThread, id, threadId, comment)
    yield put(TextileNodeActions.getPhotoHashesRequest(threadId))
  } catch (error) {
    yield put(UIActions.imageSharingError(error))
  }
}

export function * insertImage (image: SharedImage, threadId: string, comment?: string) {
  yield put(ProcessingImagesActions.insertImage(image, threadId, comment))
  yield call(addToIpfs, image, threadId, comment)
}

export function * addToIpfs (image: SharedImage, threadId: string, comment?: string) {
  try {
    yield put(ProcessingImagesActions.addingImage(image))
    const addResult: AddResult = yield call(addImage, image, threadId, comment)
    yield put(ProcessingImagesActions.imageAdded(image, addResult))
    yield call(uploadFromAddResult, addResult)
  } catch (error) {
    yield put(ProcessingImagesActions.addingError(image, error))
  }
}

export function * uploadFromAddResult (addResult: AddResult) {
  try {
    yield put(ProcessingImagesActions.uploadStarted(addResult.id))
    if (!addResult.archive) {
      throw new Error('no archive')
    }
    yield call(uploadFile, addResult.id, addResult.archive.path)
  } catch (error) {
    put(ProcessingImagesActions.error(addResult.id, error))
  }
}

export function * addToWallet (processingImage: ProcessingImage) {
  if (!processingImage.addData) {
    yield put(ProcessingImagesActions.addingError(processingImage.sharedImage, 'no AddResult'))
    return
  }
  const { id, key } = processingImage.addData.addResult
  try {
    yield put(ProcessingImagesActions.addingToWallet(id))
    const defaultThread: Thread = yield * getDefaultThread()
    const blockId: string = yield call(TextileNode.addPhotoToThread, id, key, defaultThread.id)
    yield put(ProcessingImagesActions.addedToWallet(id, blockId))
    yield call(shareToThread, processingImage)
  } catch (error) {
    yield put(ProcessingImagesActions.error(id, error))
  }
}

export function * shareToThread (processingImage: ProcessingImage) {
  if (!processingImage.addData) {
    yield put(ProcessingImagesActions.addingError(processingImage.sharedImage, 'no AddResult'))
    return
  }
  const { id } = processingImage.addData.addResult
  try {
    yield put(ProcessingImagesActions.sharingToThread(id))
    const { destinationThreadId, comment } = processingImage
    const shareBlockId: string = yield call(TextileNode.sharePhotoToThread, id, destinationThreadId, comment)
    yield put(ProcessingImagesActions.sharedToThread(id, shareBlockId))
    yield put(ProcessingImagesActions.complete(id))
  } catch (error) {
    yield put(ProcessingImagesActions.error(id, error))
  }
}

async function addImage (image: SharedImage, threadId: string, comment?: string): Promise<AddResult> {
  const addResult = await TextileNode.addPhoto(image.path)
  try {
    const exists = await RNFS.exists(image.path)
    if (exists && image.canDelete) {
      await RNFS.unlink(image.path)
    }
  } catch (e) {
  }
  return addResult
}