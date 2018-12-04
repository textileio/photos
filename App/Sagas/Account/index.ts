import { all } from 'redux-saga/effects'
import {
  refreshAccountInfo,
  setAvatar
} from './AccountSagas'

export default function * accountSaga () {
  yield all([
    refreshAccountInfo,
    setAvatar
  ])
}
