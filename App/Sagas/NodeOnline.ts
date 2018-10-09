import {call, put, take} from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import {logNewEvent} from './DeviceLogs'
import StorageActions from '../Redux/StorageRedux'

export function * onNodeOnline () {
  while (yield take(getType(TextileNodeActions.nodeOnline))) {
    yield call(logNewEvent, 'IPFS online', 'success')
    yield put(TextileNodeActions.refreshMessagesRequest())
    // Check for new photos on every online event
    yield put(StorageActions.refreshLocalImagesRequest())
  }
}
