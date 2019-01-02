import {call, put, take} from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import { logNewEvent } from './DeviceLogs'
import StorageActions from '../Redux/StorageRedux'
import MigrationActions from '../Redux/MigrationRedux'

export function * onNodeOnline () {
  while (yield take(getType(TextileNodeActions.nodeOnline))) {
    yield call(logNewEvent, 'IPFS online', 'success')

    // Check for new photos on every online event
    yield put(StorageActions.refreshLocalImagesRequest())

    // Only run this after everything else in the node is running
    yield put(MigrationActions.requestRunRecurringMigrationTasks())
  }
}
