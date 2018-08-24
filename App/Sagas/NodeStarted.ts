import { all, call, put, take } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import TextileNode from '../../TextileNode'
import AuthActions from '../Redux/AuthRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import ThreadsActions from '../Redux/ThreadsRedux'

export function * onNodeStarted () {
  while (yield take(getType(TextileNodeActions.startNodeSuccess))) {
    yield all([
      put(ThreadsActions.refreshThreadsRequest()),
      call(refreshTokens),
      call(refreshPublicKey)
    ])
  }
}

function * refreshTokens () {
  const tokens = yield call(TextileNode.getTokens)
  yield put(AuthActions.getTokensSuccess(tokens))
}

function * refreshPublicKey () {
  const publicKey = yield call(TextileNode.getPublicKey)
  yield put(PreferencesActions.getPublicKeySuccess(publicKey))
}