import { call, put, take, select } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import TextileNode from '../../TextileNode'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions, {NodeState, TextileNodeSelectors} from '../Redux/TextileNodeRedux'
import AuthActions from '../Redux/AuthRedux'


export function * onNodeCreated () {
  while (yield take(getType(TextileNodeActions.createNodeSuccess))) {
    try {
      const mnemonic = yield call(TextileNode.mnemonic)
      yield put(PreferencesActions.updatecMnemonic(mnemonic))
    } catch {
      // This only succeeds when the node is first created so this error is expected
    }
  }
}

export function * refreshTokens () {
  const nodeState = yield select(TextileNodeSelectors.nodeState)
  if (nodeState !== 'started') { // <- what is going to happen when nodeState === stopping?
    if (nodeState === NodeState.stopping || nodeState === NodeState.stopped) {
      // For now, if this happens, we'll just let the user tap Refresh like other error cases
      return Error('Failed refresh while node offline')
    }
    // Sit and wait until the the node is Created
    yield take(getType(TextileNodeActions.createNodeSuccess))
  }
  // Get new tokens
  const tokens = yield call(TextileNode.getTokens)
  yield put(AuthActions.getTokensSuccess(tokens))
}
