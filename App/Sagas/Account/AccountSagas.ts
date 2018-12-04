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

export function * refreshAccountInfo () {
  while (true) {
    try {
      yield take(getType(AccountActions.refreshAccountInfoRequest))
      const addressResult: string = yield call(address)
      const peerIdResult: string = yield call(peerId)
      const profileResult: Profile = yield call(profile)
      const seedResult: string = yield call(seed)
      const usernameResult: string | undefined = yield call(username)
      yield put(AccountActions.refreshAccountInfoSuccess(addressResult, peerIdResult, profileResult, seedResult, usernameResult))
    } catch (error) {
      yield put(AccountActions.refreshAccountInfoError(error))
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
