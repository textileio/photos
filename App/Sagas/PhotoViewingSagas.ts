import { call, put, select } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'

import PhotoViewingActions, { ThreadData } from '../Redux/PhotoViewingRedux'
import { photoAndComment } from '../Redux/PhotoViewingSelectors'
import UIActions from '../Redux/UIRedux'
import TextileNode from '../../TextileNode'
import { Threads, Thread, Photo, BlockId } from '../Models/TextileTypes'
import NavigationService from '../Services/NavigationService'

export function * addThread (action: ActionType<typeof PhotoViewingActions.addThreadRequest>) {
  const { name } = action.payload
  try {
    const thread: Thread = yield call(TextileNode.addThread, name)
    yield put(PhotoViewingActions.addThreadSuccess(thread))
    yield put(PhotoViewingActions.viewThread(thread.id))
    yield put(UIActions.navigateToThreadRequest(thread.id, thread.name))
  } catch (error) {
    yield put(PhotoViewingActions.addThreadError(error))
  }
}

export function * removeThread (action: ActionType<typeof PhotoViewingActions.removeThreadRequest>) {
  const { id } = action.payload
  try {
    // TODO: something with this blockId
    const blockId: BlockId = yield call(TextileNode.removeThread, id)
    yield put(PhotoViewingActions.removeThreadSuccess(id))
    yield call(NavigationService.navigate, 'SharedPhotos')
  } catch (error) {
    yield put(PhotoViewingActions.removeThreadError(error))
  }
}

export function * refreshThreads (action: ActionType<typeof PhotoViewingActions.refreshThreadsRequest>) {
  try {
    const threads: Threads = yield call(TextileNode.threads)
    for (const thread of threads.items) {
      yield put(PhotoViewingActions.insertThread(thread))
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
  const result:  { photo: Photo | undefined, comment: string | undefined } = yield select(photoAndComment)
  if (!result.photo || !result.comment) {
    return
  }
  try {
    yield call(TextileNode.addPhotoComment, result.photo.block_id, result.comment)
    yield put(PhotoViewingActions.addCommentSuccess())
  } catch (error) {
    console.log(error)
  }
}