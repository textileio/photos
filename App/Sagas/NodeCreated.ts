import { call, put, take } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import TextileNode from '../../TextileNode'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'


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
