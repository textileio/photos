import { call, put, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'

import TextileNode from '../../TextileNode'
import { Thread, ThreadName, Threads } from '../Models/TextileTypes'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'

export default function * getDefaultThread () {
  const threads: Threads = yield call(TextileNode.threads)
  let defaultThread: Thread | undefined = threads.items.find(thread => thread.name === 'default')
  if (!defaultThread) {
    yield put(PhotoViewingActions.addThreadRequest('default' as ThreadName))
    while (!defaultThread) {
      const action: ActionType<typeof PhotoViewingActions.addThreadSuccess> = yield take(getType(PhotoViewingActions.addThreadSuccess))
      if (action.payload.thread.name === 'default') {
        defaultThread = action.payload.thread
      }
    }
    yield put(PhotoViewingActions.refreshThreadsRequest())
  }
  return defaultThread
}
