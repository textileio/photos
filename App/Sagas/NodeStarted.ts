import { call, put, take } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import AccountActions from '../Redux/AccountRedux'
import ContactsActions from '../Redux/ContactsRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import { getSDKVersion } from './NodeLifecycle'

export function * onNodeStarted () {
  while (yield take([getType(TextileNodeActions.startNodeSuccess), getType(AccountActions.initSuccess)])) {
    try {
      // TODO: Double-check that these run fine now that they are likely called before onboarding success
      yield put(AccountActions.refreshProfileRequest())
      yield put(AccountActions.refreshPeerIdRequest())
      yield put(AccountActions.getCafeSessionsRequest())
      yield put(ContactsActions.getContactsRequest())
      yield put(PhotoViewingActions.refreshThreadsRequest())
      yield call(getSDKVersion)
    } catch (error) {
      // nothing to do here for now
    }
  }
}
