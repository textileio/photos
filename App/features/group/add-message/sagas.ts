import { ActionType, getType } from 'typesafe-actions'
import { call, put, takeEvery, all } from 'redux-saga/effects'
import Textile from '@textile/react-native-sdk'
import { addMessage} from './actions'

export function * handleAddMessageRequest(action: ActionType<typeof addMessage.request>) {
  const { id, groupId, body } = action.payload
  try {
    yield call(Textile.addMessage, groupId, body)
    yield put(addMessage.success({ id, groupId }))
  } catch (error) {
    yield put(addMessage.failure({ id, groupId, error }))
  }
}

export default function * () {
  yield all([
    takeEvery(getType(addMessage.request), handleAddMessageRequest)
  ])
}
