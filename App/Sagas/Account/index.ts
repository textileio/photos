import { all, call } from 'redux-saga/effects'
import {
  refreshAccountInfo,
  setAvatar
} from './AccountSagas'

export default function * accountSaga () {
  yield all([
    call(refreshAccountInfo),
    call(setAvatar)
  ])
}
