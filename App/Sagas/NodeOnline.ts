import {call, put, take} from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import StorageActions from '../Redux/StorageRedux'
import {logNewEvent} from './DeviceLogs'

export function * onNodeOnline () {
  while (yield take(getType(TextileNodeActions.nodeOnline))) {
    yield call(logNewEvent, 'IPFS online', 'success')
    yield put(TextileNodeActions.refreshMessagesRequest())
    yield put(StorageActions.refreshLocalImagesRequest())
  }
}
