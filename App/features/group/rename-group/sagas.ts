import { ActionType, getType } from 'typesafe-actions'
import { call, put, takeEvery, all } from 'redux-saga/effects'
import Textile from '@textile/react-native-sdk'
import { renameGroup } from './actions'
import PhotoViewingActions from '../../../Redux/PhotoViewingRedux'

export function *handleRenameGroupRequest(action: ActionType<typeof renameGroup.request>) {
  const { threadId, name } = action.payload
  try {
    yield call(Textile.threads.rename, threadId, name)
    yield put(PhotoViewingActions.updateThreadName(threadId, name))
    yield put(renameGroup.success({ threadId }))
  } catch (error) {
    yield put(renameGroup.failure({ threadId, error }))
  }
}

export default function *() {
  yield all([
    takeEvery(getType(renameGroup.request), handleRenameGroupRequest)
  ])
}
