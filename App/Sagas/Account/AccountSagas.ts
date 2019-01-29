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
  ContactInfo,
  CafeSession
} from '@textile/react-native-sdk'
import * as TextileSDK from '../SDKSagas'
import { bestSession } from '../../Redux/AccountSelectors'

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
      yield call(TextileSDK.updateUsername, action.payload.username)
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

export function * getSession (depth: number = 0): any {
  const session: CafeSession | undefined = yield select(bestSession)
  if (!session || new Date(session.expiry) < new Date()) {
    if (depth === 0) {
      yield put(AccountActions.refreshCafeSessionsRequest())
      yield take(getType(AccountActions.cafeSessionsSuccess))
      yield call(getSession, 1)
    } else {
      throw new Error('unable to get CafeSession')
    }
  } else {
    return session
  }
}

export function * getCafeSessions () {
  while (true) {
    try {
      yield take(getType(AccountActions.getCafeSessionsRequest))
      const sessions: ReadonlyArray<CafeSession> = yield call(cafeSessions)
      yield put(AccountActions.cafeSessionsSuccess(sessions))
    } catch (error) {
      yield put(AccountActions.cafeSessionsError(error))
    }
  }
}

export function * refreshCafeSessions () {
  while (true) {
    try {
      yield take(getType(AccountActions.refreshCafeSessionsRequest))
      const sessions: ReadonlyArray<CafeSession> = yield call(cafeSessions)
      const effects = sessions.map((session) => call(refreshCafeSession, session.id))
      const refreshedSessions: ReadonlyArray<CafeSession> = yield all(effects)
      yield put(AccountActions.cafeSessionsSuccess(refreshedSessions))
    } catch (error) {
      yield put(AccountActions.cafeSessionsError(error))
    }
  }
}
