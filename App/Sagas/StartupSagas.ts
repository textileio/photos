import TextileNodeActions from '../Redux/TextileNodeRedux'
import { put, all, call } from 'redux-saga/effects'
// process STARTUP actions
export function * startup (): IterableIterator<any> {
  // Dispatch actions you want on STARTUP
  // yield put(TextileNodeActions.startupComplete())
}
