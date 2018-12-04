import { take, put, call } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import AccountActions from '../../Redux/AccountRedux'
import {
  address,
  peerId,
  profile,
  seed,
  username,
  setAvatar as updateAvatar,
  Profile
} from '../../NativeModules/Textile'

export function * refreshProfile () {
  while (true) {
    try {
      yield take(getType(AccountActions.refreshProfileRequest))
      const profileResult: Profile = yield call(profile)
      yield put(AccountActions.refreshProfileSuccess(profileResult))
    } catch (error) {
      yield put(AccountActions.refreshProfileError(error))
    }
  }
}

export function * refreshPeerId () {
  while (true) {
    try {
      yield take(getType(AccountActions.refreshPeerIdRequest))
      const peerIdResult = yield call(peerId)
      yield put(AccountActions.refreshPeerIdSuccess(peerIdResult))
    } catch (error) {
      yield put(AccountActions.refreshPeerIdError(error))
    }
  }
}

export function * setAvatar () {
  while (true) {
    try {
      const action: ActionType<typeof AccountActions.setAvatarRequest> = yield take(getType(AccountActions.setAvatarRequest))
      yield call(updateAvatar, action.payload.avatarId)
    } catch (error) {
      yield put(AccountActions.setAvatarError(error))
    }
  }
}
