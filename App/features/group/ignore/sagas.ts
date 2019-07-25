import { ActionType, getType } from 'typesafe-actions'
import { call, put, takeEvery, all } from 'redux-saga/effects'
import Textile from '@textile/react-native-sdk'
import { ignore } from './actions'

export function* handleIgnoreRequest(
  action: ActionType<typeof ignore.request>
) {
  const blockId = action.payload
  try {
    yield call(Textile.ignores.add, blockId)
    yield put(ignore.success(blockId))
  } catch (error) {
    yield put(ignore.failure({ blockId, error }))
  }
}

export default function*() {
  yield all([takeEvery(getType(ignore.request), handleIgnoreRequest)])
}
