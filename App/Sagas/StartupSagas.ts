import SDKNoPersistActions from '../Redux/SDKNoPersistRedux'
import { put, all } from 'redux-saga/effects'
// process STARTUP actions
export function * startup (): IterableIterator<void> {
  // Dispatch actions you want on STARTUP
  return all([
    put(SDKNoPersistActions.startup())
  ])
}
