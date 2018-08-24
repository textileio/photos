import { call, put, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'

import TextileNode from '../../TextileNode'
import { Thread, ThreadName, Threads } from '../Models/TextileTypes'
import ThreadsActions from '../Redux/ThreadsRedux'

export default function * getDefaultThread () {
  const threads: Threads = yield call(TextileNode.threads)
  let defaultThread: Thread | undefined = threads.items.find(thread => thread.name === 'default')
  if (!defaultThread) {
    yield put(ThreadsActions.addThreadRequest('default' as ThreadName))
    while (!defaultThread) {
      const action: ActionType<typeof ThreadsActions.addThreadSuccess> = yield take(getType(ThreadsActions.addThreadSuccess))
      if (action.payload.thread.name === 'default') {
        defaultThread = action.payload.thread
      }
    }
    yield put(ThreadsActions.refreshThreadsRequest())
  }
  return defaultThread
}
