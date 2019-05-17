import { ActionType, getType } from 'typesafe-actions'
import { call, put, takeEvery, all } from 'redux-saga/effects'
import Textile from '@textile/react-native-sdk'
import { renameGroup } from './actions'
import UIActions from '../../../Redux/UIRedux'

export function *handleRenameGroupRequest(action: ActionType<typeof renameGroup.request>) {
  const { threadId, name } = action.payload
  try {
    yield call(Textile.threads.rename, threadId, name)
    yield put(renameGroup.success({ threadId }))
    yield put(UIActions.navigateToThreadRequest(threadId, name))
  } catch (error) {
    yield put(renameGroup.failure({ threadId, error }))
  }
}

export function *watchForRenameGroupRequests() {
  yield takeEvery(getType(renameGroup.request), handleRenameGroupRequest)
}

export default function *() {
  yield all([
    call(watchForRenameGroupRequests)
  ])
}
