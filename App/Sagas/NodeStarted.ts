import { call, put, take } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import AccountActions from '../Redux/AccountRedux'
import ContactsActions from '../Redux/ContactsRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import { getSDKVersion } from './NodeLifecycle'

export function * onNodeStarted () {
  while (yield take([getType(TextileNodeActions.startNodeSuccess), getType(PreferencesActions.onboardedSuccess)])) {
    try {
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
