import { all, call } from 'redux-saga/effects'
import {
  refreshProfile,
  refreshPeerId,
  setUsername,
  setAvatar,
  getCafeSessions,
  refreshCafeSessions,
  onNodeStarted
} from './AccountSagas'

export default function * accountSaga () {
  console.log('axh wait, i run also')
  yield all([
    call(refreshProfile),
    call(refreshPeerId),
    call(setUsername),
    call(setAvatar),
    call(getCafeSessions),
    call(refreshCafeSessions),
    call(onNodeStarted)
  ])
}
