import { call, put, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'

import TextileNode from '../../TextileNode'
import { Threads } from '../Models/TextileTypes'
import ThreadsActions from '../Redux/ThreadsRedux'

export default function * getDefaultThread () {
  const threads: Threads = yield call(TextileNode.threads)
  var defaultThread = threads.items.find(thread => thread.name === 'default')
  if (!defaultThread) {
    yield put(ThreadsActions.addThreadRequest('default'))
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
