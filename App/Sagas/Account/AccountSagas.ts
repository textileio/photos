import { take, put, call, all, select } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import AccountActions from '../../Redux/AccountRedux'
import ContactsActions from '../../Redux/ContactsRedux'
import PhotoViewingActions from '../../Redux/PhotoViewingRedux'
import PreferencesActions from '../../Redux/PreferencesRedux'
import TextileEventsActions from '../../Redux/TextileEventsRedux'
import {
  cafeSessions,
  refreshCafeSession,
  peerId,
  profile,
  ContactInfo
} from '@textile/react-native-sdk'
import Textile from '../../SDK'
import { bestSession, getSessionMillis } from '../../Redux/AccountSelectors'
import { ICafeSession, ICafeSessions } from '@textile/react-native-protobufs'

export function * onNodeStarted () {
  while (yield take([getType(TextileEventsActions.startNodeFinished), getType(PreferencesActions.onboardingSuccess)])) {
    try {
      yield put(AccountActions.refreshProfileRequest())
      yield put(AccountActions.refreshPeerIdRequest())
      yield put(AccountActions.getCafeSessionsRequest())
      yield put(ContactsActions.getContactsRequest())
      yield put(PhotoViewingActions.refreshThreadsRequest())
    } catch (error) {
      // nothing to do here for now
    }
  }
}

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
      const online: boolean = yield call(Textile.nodeOnline)
      if (!online) {
        yield take(getType(TextileEventsActions.nodeOnline))
      }
      // Ideally this could move into the SDK directly so it can manage
      // knowing its own online state
      yield call(Textile.api.setUsername, action.payload.username)
      yield put(TextileEventsActions.updateProfile())
    } catch (error) {
      yield put(AccountActions.profileError(error))
    }
  }
}

export function * setAvatar () {
  while (true) {
    try {
      const action: ActionType<typeof AccountActions.setAvatarRequest> = yield take(getType(AccountActions.setAvatarRequest))
      const online: boolean = yield call(Textile.nodeOnline)
      if (!online) {
        yield take(getType(TextileEventsActions.nodeOnline))
      }
      // Ideally this could move into the SDK directly so it can manage
      // knowing its own online state
      yield call(Textile.api.setAvatar, action.payload.avatar)
      yield put(TextileEventsActions.updateProfile())
    } catch (error) {
      yield put(AccountActions.setAvatarError(error))
    }
  }
}

export function * getSession (depth: number = 0): any {
  const session: ICafeSession | undefined = yield select(bestSession)
  if (!session) {
    return undefined
  }
  const millis = getSessionMillis(session)
  if (new Date(millis) < new Date()) {
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
      const values = yield call(Textile.getCafeSessions)
      yield put(AccountActions.cafeSessionsSuccess(values))
    } catch (error) {
      yield put(AccountActions.cafeSessionsError(error))
    }
  }
}

export function * refreshCafeSessions () {
  while (true) {
    try {
      yield take(getType(AccountActions.refreshCafeSessionsRequest))
      const values = yield call(Textile.getRefreshedCafeSessions)
      yield put(AccountActions.cafeSessionsSuccess(values))
    } catch (error) {
      yield put(AccountActions.cafeSessionsError(error))
    }
  }
}
