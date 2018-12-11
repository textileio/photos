import { select, take } from 'redux-saga/effects'
import { RootState } from '../Redux/Types'

export function * waitFor (selector: (state: RootState) => boolean) {
  if (yield select(selector)) {
    return
  }
  while (true) {
    yield take('*')
    if (yield select(selector)) {
      return
    }
  }
}
