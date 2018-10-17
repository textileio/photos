import { delay } from 'redux-saga'
import { call, put, select, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'

import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import UIActions from '../Redux/UIRedux'
import { photoAndComment, shouldNavigateToNewThread, shouldSelectNewThread, photoToShareToNewThread } from '../Redux/PhotoViewingSelectors'
import TextileNode from '../../TextileNode'
import { Threads, Photo, BlockId, PhotoId } from '../Models/TextileTypes'
import NavigationService from '../Services/NavigationService'
import { shareWalletImage } from './ImageSharingSagas'

export function * monitorNewThreadActions () {
  while (true) {
    const action: ActionType<typeof PhotoViewingActions.threadAdded> = yield take(getType(PhotoViewingActions.threadAdded))
    const shouldNav: boolean = yield select(shouldNavigateToNewThread)
    const shouldSelect: boolean = yield select(shouldSelectNewThread)
    const photoToShare: { threadName: string, imageId: PhotoId, comment?: string} | undefined = yield select(photoToShareToNewThread)
    yield put(PhotoViewingActions.clearNewThreadActions())
    const { id, name } = action.payload
    if (photoToShare && photoToShare.threadName === name) {
      const { imageId, comment } = photoToShare
      yield call(shareWalletImage, imageId, id, comment)
    }
    if (shouldNav) {
      yield put(PhotoViewingActions.viewThread(action.payload.id))
      yield delay(700)
      yield call(NavigationService.navigate, 'ViewThread')
    }
    if (shouldSelect) {
      yield put(UIActions.updateSharingPhotoThread(action.payload.id))
    }
  }
}

export function * addThread (action: ActionType<typeof PhotoViewingActions.addThreadRequest>) {
  const { name } = action.payload
  try {
    yield call(TextileNode.addThread, name)
  } catch (error) {
    yield put(PhotoViewingActions.addThreadError(error))
  }
}

export function * removeThread (action: ActionType<typeof PhotoViewingActions.removeThreadRequest>) {
  const { id } = action.payload
  try {
    yield call(TextileNode.removeThread, id)
    yield call(NavigationService.navigate, 'SharedPhotos')
  } catch (error) {
    yield put(PhotoViewingActions.removeThreadError(error))
  }
}

export function * refreshThreads (action: ActionType<typeof PhotoViewingActions.refreshThreadsRequest>) {
  try {
    const threads: Threads = yield call(TextileNode.threads)
    for (const thread of threads.items) {
      yield put(PhotoViewingActions.insertThread(thread.id, thread.name))
      yield put(PhotoViewingActions.refreshThreadRequest(thread.id))
    }
  } catch (error) {
    yield put(PhotoViewingActions.refreshThreadsError(error))
  }
}

export function * refreshThread (action: ActionType<typeof PhotoViewingActions.refreshThreadRequest>) {
  const { threadId } = action.payload
  try {
    const photos: Photo[] = yield call(TextileNode.getPhotos, -1, threadId)
    yield put(PhotoViewingActions.refreshThreadSuccess(threadId, photos))
  } catch (error) {
    yield put(PhotoViewingActions.refreshThreadError(threadId, error))
  }
}

export function * addPhotoComment (action: ActionType<typeof PhotoViewingActions.addCommentRequest>) {
  const result: { photo: Photo | undefined, comment: string | undefined } = yield select(photoAndComment)
  if (!result.photo || !result.comment) {
    return
  }
  try {
    yield call(TextileNode.addPhotoComment, result.photo.block_id, result.comment)
    yield put(PhotoViewingActions.addCommentSuccess())
  } catch (error) {
  }
}
