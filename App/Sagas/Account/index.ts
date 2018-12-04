import { all, call } from 'redux-saga/effects'
import {
  refreshProfile,
  refreshPeerId,
  setAvatar
} from './AccountSagas'

export default function * accountSaga () {
  yield all([
    call(refreshProfile),
    call(refreshPeerId),
    call(setAvatar)
  ])
}
