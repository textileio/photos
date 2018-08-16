import { call, put } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'
import RNFS from 'react-native-fs'

import { uploadFile } from './UploadFile'
import TextileNode from '../../TextileNode'
import { SharedImage, AddResult } from '../Models/TextileTypes'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import ProcessingImagesActions from '../Redux/ProcessingImagesRedux'
import UIActions from '../Redux/UIRedux'

export function * handleSharePhotoRequest(action: ActionType<typeof UIActions.sharePhotoRequest>) {
  const { image, threadId, comment } = action.payload
  if (!image || !threadId) {
    return
  }
  if (typeof image === 'string') {
    yield call(shareWalletImage, image, threadId, comment)
  } else {
    yield call(addAndUploadImage, image, threadId, comment)
  }
}

function * shareWalletImage (id: string, threadId: string, comment?: string) {
  try {
    // TODO: Insert some state into the processing photos redux in case this takes long or fails
    const blockId: string = yield call(TextileNode.sharePhotoToThread, id, threadId, comment)
    yield put(TextileNodeActions.getPhotoHashesRequest(threadId))
  } catch (error) {
    yield put(UIActions.imageSharingError(error))
  }
}

function * addAndUploadImage (image: SharedImage, threadId: string, comment?: string) {
  try {
    yield put(ProcessingImagesActions.insertAddingImage(image, threadId, comment))
    const addResult: AddResult = yield call(TextileNode.addPhoto, image.path)
    if (!addResult.archive) {
      throw new Error('no archive returned')
    }
    try {
      const exists: boolean = yield call(RNFS.exists, image.path)
      if (exists && image.canDelete) {
        yield call(RNFS.unlink, image.path)
      }
    } catch (e) {}
    yield put(ProcessingImagesActions.imageAdded(image, addResult))
    yield call(uploadFile, addResult.id, addResult.archive.path)
  } catch (error) {
    yield put(ProcessingImagesActions.addingError(image, error))
    // TODO: Unlink now or later?
    // Maybe we want to leave it up to the user to retry or cancel share.
    // In that case, we don't want to unlink here
  }
}