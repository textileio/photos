import { call, put, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'

import TextileNode from '../../TextileNode'
import * as TT from '../Models/TextileTypes'
import ThreadsActions from '../Redux/ThreadsRedux'

export default function * getDefaultThread () {
  const threads: TT.Threads = yield call(TextileNode.threads)
  let defaultThread: TT.Thread | undefined = threads.items.find(thread => thread.name === 'default')
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
