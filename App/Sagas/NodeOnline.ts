import {call, put, take} from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import Config from 'react-native-config'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import { logNewEvent } from './DeviceLogs'
import StorageActions from '../Redux/StorageRedux'
import MigrationActions from '../Redux/MigrationRedux'
import { CafeSession, registerCafe, cafeSessions } from '../NativeModules/Textile'

export function * onNodeOnline () {
  while (yield take(getType(TextileNodeActions.nodeOnline))) {
    yield call(logNewEvent, 'IPFS online', 'success')

    // Make sure we've registered the Cafes
    const sessions: ReadonlyArray<CafeSession> = yield call(cafeSessions)
    const cafesString: string = Config.RN_TEXTILE_CAFES
    const cafeIds = cafesString.split(',')
    for (const cafeId of cafeIds) {
      // TODO: Add some error handling here, maybe state management
      const session = sessions.find((session) => session.cafe_id === cafeId)
      if (!session) {
        yield call(registerCafe, cafeId)
      }
    }

    // Check for new photos on every online event
    yield put(StorageActions.refreshLocalImagesRequest())

    // Only run this after everything else in the node is running
    yield put(MigrationActions.requestRunRecurringMigrationTasks())
  }
}
