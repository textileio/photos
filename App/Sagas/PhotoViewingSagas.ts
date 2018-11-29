import { delay } from 'redux-saga'
import { call, put, select, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'

import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import { ThreadsSelectors, InboundInvite } from '../Redux/ThreadsRedux'
import UIActions from '../Redux/UIRedux'
import { photoAndComment, shouldNavigateToNewThread, shouldSelectNewThread, photoToShareToNewThread } from '../Redux/PhotoViewingSelectors'
import {
  addThread as add,
  removeThread as remove,
  threads,
  threadFiles,
  addThreadComment,
  ThreadFilesInfo,
  ThreadInfo
} from '../NativeModules/Textile'
import NavigationService from '../Services/NavigationService'
import { shareWalletImage } from './ImageSharingSagas'

export function * monitorNewThreadActions () {
  while (true) {
    const action: ActionType<typeof PhotoViewingActions.threadAdded> = yield take(getType(PhotoViewingActions.threadAdded))
    const { id, name } = action.payload
    const photoToShare: { threadName: string, imageId: string, comment?: string} | undefined = yield select(photoToShareToNewThread)
    const shouldNav: boolean = yield select(shouldNavigateToNewThread)
    const shouldSelect: boolean = yield select(shouldSelectNewThread)
    const invite: InboundInvite | undefined = yield select(ThreadsSelectors.inboundInviteByThreadName, name)

    yield put(PhotoViewingActions.clearNewThreadActions())

    if (photoToShare && photoToShare.threadName === name) {
      const { imageId, comment } = photoToShare
      yield call(shareWalletImage, imageId, id, comment)
    }

    if (shouldNav) {
      yield put(PhotoViewingActions.viewThread(id))
      yield delay(700)
      yield call(NavigationService.navigate, 'ViewThread')
    } else if (shouldSelect) {
      yield put(UIActions.updateSharingPhotoThread(id))
    } else if (invite) {
      yield put(PhotoViewingActions.viewThread(id))
      yield call(NavigationService.navigate, 'ViewThread')
    }
  }
}

export function * addThread (action: ActionType<typeof PhotoViewingActions.addThreadRequest>) {
  const { key, name } = action.payload
  try {
    yield call(add, key, name)
  } catch (error) {
    yield put(PhotoViewingActions.addThreadError(error))
  }
}

export function * removeThread (action: ActionType<typeof PhotoViewingActions.removeThreadRequest>) {
  const { id } = action.payload
  try {
    yield call(remove, id)
    yield call(NavigationService.navigate, 'SharedPhotos')
  } catch (error) {
    yield put(PhotoViewingActions.removeThreadError(error))
  }
}

export function * refreshThreads (action: ActionType<typeof PhotoViewingActions.refreshThreadsRequest>) {
  try {
    const threadsResult: ReadonlyArray<ThreadInfo> = yield call(threads)
    for (const thread of threadsResult) {
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
    const photosResult: ReadonlyArray<ThreadFilesInfo> = yield call(threadFiles, '', -1, threadId)
    yield put(PhotoViewingActions.refreshThreadSuccess(threadId, photosResult))
  } catch (error) {
    yield put(PhotoViewingActions.refreshThreadError(threadId, error))
  }
}

export function * addPhotoComment (action: ActionType<typeof PhotoViewingActions.addCommentRequest>) {
  const result: { photo: ThreadFilesInfo | undefined, comment: string | undefined } = yield select(photoAndComment)
  if (!result.photo || !result.comment) {
    return
  }
  try {
    yield call(addThreadComment, result.photo.block, result.comment)
    yield put(PhotoViewingActions.addCommentSuccess())
  } catch (error) {
  }
}
