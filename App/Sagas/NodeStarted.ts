import { all, call, put, take } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import TextileNode from '../../TextileNode'
import AuthActions from '../Redux/AuthRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import ThreadsActions from '../Redux/ThreadsRedux'

export function * onNodeStarted () {
  while (yield take([getType(TextileNodeActions.startNodeSuccess), getType(PreferencesActions.onboardedSuccess)])) {
    try {
      yield all([
        put(ThreadsActions.refreshThreadsRequest()),
        call(refreshPublicKey)
      ])
    } catch (error) {
      // nothing to do here for now
    }
  }
}

function * refreshPublicKey () {
  const publicKey = yield call(TextileNode.getPublicKey)
  yield put(PreferencesActions.getPublicKeySuccess(publicKey))
}
