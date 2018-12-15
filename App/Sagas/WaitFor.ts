import { select, take, SelectEffect } from 'redux-saga/effects'
import { RootState } from '../Redux/Types'

export function * waitFor (selectEffect: SelectEffect) {
  if (yield selectEffect) {
    return true
  }
  while (true) {
    yield take('*')
    if (yield selectEffect) {
      return true
    }
  }
}
