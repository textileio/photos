import { call, put, take, select } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import TextileNode from '../Services/TextileNode'
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

export function * refreshTokens (force: boolean) {
  const nodeState = yield select(TextileNodeSelectors.nodeState)
  if (nodeState === NodeState.nonexistent || nodeState === NodeState.creating) {
    // Sit and wait until the the node is Created
    yield take(getType(TextileNodeActions.createNodeSuccess))
  }
  // Get new tokens
  const tokens = yield call(TextileNode.getTokens, force)
  yield put(AuthActions.getTokensSuccess(tokens))
}
