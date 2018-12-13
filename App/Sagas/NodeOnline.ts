import {call, put, take} from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import Config from 'react-native-config'
import { getSDKVersion } from './NodeLifecycle'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import { logNewEvent } from './DeviceLogs'
import StorageActions from '../Redux/StorageRedux'
import { cafeSessions } from '../Services/CafeSessions'
import { CafeSession, registerCafe } from '../NativeModules/Textile'

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

    yield put(TextileNodeActions.refreshMessagesRequest())

    // Check for new photos on every online event
    yield put(StorageActions.refreshLocalImagesRequest())

    // update
    yield call(getSDKVersion)
  }
}
