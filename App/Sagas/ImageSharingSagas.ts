import { call, put, select } from 'redux-saga/effects'
import RNFS from 'react-native-fs'
import uuid from 'uuid/v4'

import { uploadFile } from './UploadFile'
import getDefaultThread from './GetDefaultThread'
import TextileNode from '../../TextileNode'
import { AddResult, BlockId, SharedImage, PhotoId, Thread, ThreadId } from '../Models/TextileTypes'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import ProcessingImagesActions, { ProcessingImage, ProcessingImagesSelectors } from '../Redux/ProcessingImagesRedux'
import UIActions from '../Redux/UIRedux'
import {ActionType} from 'typesafe-actions'

export function * shareWalletImage (id: PhotoId, threadId: ThreadId, comment?: string) {
  try {
    // TODO: Insert some state into the processing photos redux in case this takes long or fails
    const blockId: BlockId = yield call(TextileNode.sharePhotoToThread, id, threadId, comment)
  } catch (error) {
    yield put(UIActions.imageSharingError(error))
  }
}

export function * insertImage (image: SharedImage, threadId: ThreadId, comment?: string) {
  const id = uuid()
  yield put(ProcessingImagesActions.insertImage(id, image, threadId, comment))
  yield call(addToIpfs, id)
}

export function * addToIpfs (uuid: string) {
  try {
    const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByUuid, uuid)
    if (!processingImage) {
      throw new Error('no ProcessingImage found')
    }
    yield put(ProcessingImagesActions.addingImage(uuid))
    const { sharedImage, destinationThreadId, comment } = processingImage
    const addResult: AddResult = yield call(addImage, sharedImage, destinationThreadId, comment)
    yield put(ProcessingImagesActions.imageAdded(uuid, addResult))
    yield call(uploadArchive, uuid)
  } catch (error) {
    yield put(ProcessingImagesActions.error(uuid, error))
  }
}

export function * uploadArchive (uuid: string) {
  try {
    const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByUuid, uuid)
    if (!processingImage) {
      throw new Error('no ProcessingImage found')
    }
    yield put(ProcessingImagesActions.uploadStarted(uuid))
    if (!processingImage.addData || !processingImage.addData.addResult.archive) {
      throw new Error('no addData or archive')
    }
    yield call(uploadFile, uuid, processingImage.addData.addResult.archive.path)
  } catch (error) {
    put(ProcessingImagesActions.error(uuid, error))
  }
}

export function * addToWallet (uuid: string) {
  try {
    const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByUuid, uuid)
    if (!processingImage || !processingImage.addData) {
      throw new Error('no ProcessingImage or addData found')
    }
    const { id, key } = processingImage.addData.addResult
    yield put(ProcessingImagesActions.addingToWallet(uuid))
    const defaultThread: Thread = yield * getDefaultThread()
    const blockId: BlockId = yield call(TextileNode.addPhotoToThread, id, key, defaultThread.id)
    yield put(ProcessingImagesActions.addedToWallet(uuid, blockId))
    yield call(shareToThread, uuid)
  } catch (error) {
    yield put(ProcessingImagesActions.error(uuid, error))
  }
}

export function * shareToThread (uuid: string) {
  try {
    const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByUuid, uuid)
    if (!processingImage || !processingImage.addData) {
      throw new Error('no ProcessingImage or addData found')
    }
    const { id } = processingImage.addData.addResult
    yield put(ProcessingImagesActions.sharingToThread(uuid))
    const { destinationThreadId, comment } = processingImage
    const shareBlockId: BlockId = yield call(TextileNode.sharePhotoToThread, id, destinationThreadId, comment)
    yield put(ProcessingImagesActions.sharedToThread(uuid, shareBlockId))
    yield put(ProcessingImagesActions.complete(uuid))
  } catch (error) {
    yield put(ProcessingImagesActions.error(uuid, error))
  }
}

async function addImage (image: SharedImage, threadId: ThreadId, comment?: string): Promise<AddResult> {
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
