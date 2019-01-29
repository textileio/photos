import { take, put, call, all } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import AccountActions from '../../Redux/AccountRedux'
import {
  cafeSessions,
  refreshCafeSession,
  peerId,
  profile,
  setAvatar as updateAvatar,
  setUsername as username,
  ContactInfo
} from '@textile/react-native-sdk'
import { ICafeSession, ICafeSessions } from '@textile/react-native-protobufs'

export function * refreshProfile () {
  while (true) {
    try {
      yield take(getType(AccountActions.refreshProfileRequest))
      const profileResult: ContactInfo = yield call(profile)
      yield put(AccountActions.refreshProfileSuccess(profileResult))
    } catch (error) {
      yield put(AccountActions.profileError(error))
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

export function * setUsername () {
  while (true) {
    try {
      const action: ActionType<typeof AccountActions.setUsernameRequest> = yield take(getType(AccountActions.setUsernameRequest))
      yield call(username, action.payload.username)
      // Setting the username makes it available in the Profile, so update it
      const profileResult: ContactInfo = yield call(profile)
      yield put(AccountActions.refreshProfileSuccess(profileResult))
    } catch (error) {
      yield put(AccountActions.profileError(error))
    }
  }
}

export function * setAvatar () {
  while (true) {
    try {
      const action: ActionType<typeof AccountActions.setAvatarRequest> = yield take(getType(AccountActions.setAvatarRequest))
      yield call(updateAvatar, action.payload.avatar)
    } catch (error) {
      yield put(AccountActions.setAvatarError(error))
    }
  }
}

export function * getCafeSessions () {
  while (true) {
    try {
      yield take(getType(AccountActions.getCafeSessionsRequest))
      const sessions: ICafeSessions = yield call(cafeSessions)
      if (!sessions) {
        yield put(AccountActions.cafeSessionsSuccess([]))
      }
      const values: ReadonlyArray<ICafeSession> | undefined | null = sessions.values
      if (!values) {
        yield put(AccountActions.cafeSessionsSuccess([]))
      } else {
        yield put(AccountActions.cafeSessionsSuccess(values))
      }
    } catch (error) {
      yield put(AccountActions.cafeSessionsError(error))
    }
  }
}

export function * refreshCafeSessions () {
  while (true) {
    try {
      yield take(getType(AccountActions.refreshCafeSessionsRequest))
      const sessions: Readonly<ICafeSessions> = yield call(cafeSessions)
      if (!sessions) {
        yield put(AccountActions.cafeSessionsSuccess([]))
      }
      const values: ReadonlyArray<ICafeSession> | undefined | null = sessions.values
      if (!values) {
        yield put(AccountActions.cafeSessionsSuccess([]))
      } else {
        const effects = values.map((session) => call(refreshCafeSession, session.id!))
        const refreshedValues: ReadonlyArray<ICafeSession> = yield all(effects)
        yield put(AccountActions.cafeSessionsSuccess(refreshedValues))
      }
    } catch (error) {
      yield put(AccountActions.cafeSessionsError(error))
    }
  }
}
