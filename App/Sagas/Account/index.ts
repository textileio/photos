import { all, call } from 'redux-saga/effects'
import {
  refreshProfile,
  refreshPeerId,
  refreshAddress,
  setUsername,
  setAvatar,
  getCafeSessions,
  refreshCafeSessions,
  onNodeStarted
} from './AccountSagas'

export default function * accountSaga () {
  yield all([
    call(onNodeStarted),
    call(refreshProfile),
    call(refreshPeerId),
    call(refreshAddress),
    call(setUsername),
    call(setAvatar),
    call(getCafeSessions),
    call(refreshCafeSessions)
  ])
}
