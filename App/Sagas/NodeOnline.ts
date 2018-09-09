import { put, take } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import StorageActions from '../Redux/StorageRedux'

export function * onNodeOnline () {
  while (yield take(getType(TextileNodeActions.nodeOnline))) {
    yield put(TextileNodeActions.refreshMessagesRequest())
    yield put(StorageActions.refreshLocalImagesRequest())
  }
}
