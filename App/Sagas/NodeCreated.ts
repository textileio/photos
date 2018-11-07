import { call, put, take, select } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { cafeSessions } from '../NativeModules/Textile'
import TextileNodeActions, {NodeState, TextileNodeSelectors} from '../Redux/TextileNodeRedux'
import AuthActions from '../Redux/AuthRedux'
import { CafeSessions } from '../NativeModules/Textile'

export function * refreshTokens (force: boolean) {
  const nodeState = yield select(TextileNodeSelectors.nodeState)
  if (nodeState === NodeState.nonexistent || nodeState === NodeState.creating) {
    // Sit and wait until the the node is Created
    yield take(getType(TextileNodeActions.createNodeSuccess))
  }
  // Get new tokens
  const sessions: CafeSessions = yield call(cafeSessions, force)
  yield put(AuthActions.getSessionsSuccess(sessions))
}
