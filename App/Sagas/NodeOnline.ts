import {call, put, select, take} from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import { logNewEvent } from './DeviceLogs'
import StorageActions from '../Redux/StorageRedux'
import MigrationActions from '../Redux/MigrationRedux'
import { TextileNodeSelectors } from '../Redux/TextileNodeRedux'
import { RootState } from '../Redux/Types'
import {
  setAvatar
} from '@textile/react-native-sdk'

export function * onNodeOnline () {
  while (yield take(getType(TextileNodeActions.nodeOnline))) {
    yield call(logNewEvent, 'IPFS online', 'success')

    // Check for new photos on every online event
    yield put(StorageActions.refreshLocalImagesRequest())

    // Only run this after everything else in the node is running
    yield put(MigrationActions.requestRunRecurringMigrationTasks())
  }
}

export function * nodeOnlineSaga () {
  const online = yield select(TextileNodeSelectors.online)
  if (online) {
    try {
      const pending: string | undefined = yield select((state: RootState) => state.account.avatar.pending)
      if (pending) {
        yield call(setAvatar, pending)
      }
    } catch (error) {
      // nada
    }
  }
}
