import { call, put, select, take, fork } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'

import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import TextileNode from '../../TextileNode'
import { Threads, Photo } from '../Models/TextileTypes'

export function * addThread (action: ActionType<typeof ThreadsActions.addThreadRequest>) {
  const { name, mnemonic } = action.payload
  try {
    const thread: Thread = yield call(TextileNode.addThread, name, mnemonic)
    yield put(ThreadsActions.addThreadSuccess(thread))
    yield put(UIActions.viewThreadRequest(thread.id, thread.name))
  } catch (error) {
    yield put(ThreadsActions.addThreadError(error))
  }
}


export function * removeThread (action: ActionType<typeof ThreadsActions.removeThreadRequest>) {
  const { id } = action.payload
  try {
    // TODO: something with this blockId
    const blockId: BlockId = yield call(TextileNode.removeThread, id)
    yield put(ThreadsActions.removeThreadSuccess(id))
    yield call(NavigationService.goBack)
  } catch (error) {
    yield put(ThreadsActions.removeThreadError(error))
  }
}

export function * refreshThreads (action: ActionType<typeof PhotoViewingActions.refreshThreadsRequest>) {
  try {
    const threads: Threads = yield call(TextileNode.threads)
    for (const thread of threads.items) {
      yield put(PhotoViewingActions.refreshThreadRequest(thread))
    }
  } catch (error) {
    yield put(PhotoViewingActions.refreshThreadsError(error))
  }
}

export function * refreshThread (action: ActionType<typeof PhotoViewingActions.refreshThreadRequest>) {
  const { thread } = action.payload
  try {
    const photos: Photo[] = yield call(TextileNode.getPhotos, -1, thread.id)
    yield put(PhotoViewingActions.refreshThreadSuccess(thread, photos))
  } catch (error) {
    yield put(PhotoViewingActions.refreshThreadError(thread, error))
  }
}