import { all, call } from 'redux-saga/effects'
import {
  refreshProfile,
  refreshPeerId,
  setUsername,
  setAvatar,
  getCafeSessions,
  refreshCafeSessions
} from './AccountSagas'

export default function * accountSaga () {
  yield all([
    call(refreshProfile),
    call(refreshPeerId),
    call(setUsername),
    call(setAvatar),
    call(getCafeSessions),
    call(refreshCafeSessions)
  ])
}
