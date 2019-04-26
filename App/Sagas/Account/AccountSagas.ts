import { take, put, call, all, select, fork } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import Config from 'react-native-config'
import Textile, {
  IContact,
  ICafeSession,
  ICafeSessionList
} from '@textile/react-native-sdk'

import AccountActions from '../../Redux/AccountRedux'
import { contactsActions } from '../../features/contacts'
import PhotoViewingActions from '../../Redux/PhotoViewingRedux'
import PreferencesActions from '../../Redux/PreferencesRedux'
import TextileEventsActions, { TextileEventsSelectors } from '../../Redux/TextileEventsRedux'
import { bestSession } from '../../Redux/AccountSelectors'
import { logNewEvent } from '../DeviceLogs'
import CafeGatewayApi from '../../Services/cafe-gateway-api'

export function * onNodeStarted() {
  while (yield take([getType(TextileEventsActions.nodeStarted), getType(PreferencesActions.onboardingSuccess)])) {
    yield call(logNewEvent, 'nodeStarted', 'refresh account data')
    try {
      yield fork(registerCafesIfNeeded)
      yield put(AccountActions.refreshProfileRequest())
      yield put(AccountActions.refreshPeerIdRequest())
      yield put(AccountActions.refreshAddressRequest())
      yield put(AccountActions.getCafeSessionsRequest())
      yield put(contactsActions.getContactsRequest())
      yield put(PhotoViewingActions.refreshThreadsRequest())
    } catch (error) {
      // nothing to do here for now
    }
  }
}

export function * refreshProfile() {
  while (true) {
    try {
      yield take(getType(AccountActions.refreshProfileRequest))
      const profileResult: IContact | undefined = yield call(Textile.account.contact)
      if (profileResult) {
        yield put(AccountActions.refreshProfileSuccess(profileResult))
      }
    } catch (error) {
      yield call(logNewEvent, 'refreshProfile', error.message, true)
      yield put(AccountActions.profileError(error))
    }
  }
}

export function * refreshPeerId() {
  while (true) {
    try {
      yield take(getType(AccountActions.refreshPeerIdRequest))
      const peerIdResult = yield call(Textile.ipfs.peerId)
      yield put(AccountActions.refreshPeerIdSuccess(peerIdResult))
    } catch (error) {
      yield put(AccountActions.refreshPeerIdError(error))
    }
  }
}

export function * refreshAddress() {
  while (true) {
    try {
      yield take(getType(AccountActions.refreshAddressRequest))
      const addressResult = yield call(Textile.account.address)
      yield put(AccountActions.refreshAddressSuccess(addressResult))
    } catch (error) {
      yield put(AccountActions.refreshAddressError(error))
    }
  }
}

export function * setUsername() {
  while (true) {
    try {
      const action: ActionType<typeof AccountActions.setUsernameRequest> = yield take(getType(AccountActions.setUsernameRequest))
      const started = yield select(TextileEventsSelectors.started)
      if (!started) {
        yield take(getType(TextileEventsActions.nodeStarted))
      }
      // Ideally this could move into the SDK directly so it can manage
      // knowing its own online state
      yield call(Textile.profile.setName, action.payload.username)
      yield put(TextileEventsActions.updateProfile())
    } catch (error) {
      yield put(AccountActions.profileError(error))
    }
  }
}

export function * setAvatar() {
  while (true) {
    try {
      const action: ActionType<typeof AccountActions.setAvatarRequest> = yield take(getType(AccountActions.setAvatarRequest))
      const started = yield select(TextileEventsSelectors.started)
      if (!started) {
        yield take(getType(TextileEventsActions.nodeStarted))
      }
      // Ideally this could move into the SDK directly so it can manage
      // knowing its own online state
      yield call(Textile.profile.setAvatar, action.payload.avatar)
      yield put(TextileEventsActions.updateProfile())
    } catch (error) {
      yield put(AccountActions.setAvatarError(error))
    }
  }
}

export function * getSession(depth: number = 0): any {
  const session: ICafeSession | undefined = yield select(bestSession)
  if (!session) {
    return undefined
  }
  const expDate = Textile.util.timestampToDate(session.exp)
  if (expDate < new Date()) {
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

export function * getCafeSessions() {
  while (true) {
    try {
      yield take(getType(AccountActions.getCafeSessionsRequest))
      const list: ICafeSessionList | undefined = yield call(Textile.cafes.sessions)
      if (list) {
        yield put(AccountActions.cafeSessionsSuccess(list.items))
      }
    } catch (error) {
      yield call(logNewEvent, 'getCafeSessions', error.message, true)
      yield put(AccountActions.cafeSessionsError(error))
    }
  }
}

export function * refreshCafeSessions() {
  while (true) {
    try {
      yield take(getType(AccountActions.refreshCafeSessionsRequest))
      let sessions: ICafeSession[] = []
      const list: ICafeSessionList | undefined = yield call(Textile.cafes.sessions)
      if (list) {
        const refreshEffcts = list.items.map((session) => {
          return call(Textile.cafes.refreshSession, session.id)
        })
        const results: Array<ICafeSession | undefined> = yield all(refreshEffcts)
        sessions = results.reduce<ICafeSession[]>((acc, val) => {
          if (val) {
            acc.push(val)
          }
          return acc
        }, [])
      }
      yield put(AccountActions.cafeSessionsSuccess(sessions))
    } catch (error) {
      yield put(AccountActions.cafeSessionsError(error))
    }
  }
}

function * registerCafesIfNeeded() {
  try {
    const list: ICafeSessionList | undefined = yield call(Textile.cafes.sessions)
    if (!list || list.items.length < 1) {
      yield call(registerCafes)
      yield put(AccountActions.getCafeSessionsRequest())
    }
  } catch (error) {
    yield call(logNewEvent, 'registerCafesIfNeeded', error.message, true)
  }
}

async function registerCafes() {
  const cafes = await CafeGatewayApi.discoveredCafes()
  const token = Config.RN_TEXTILE_CAFE_TOKEN
  if (cafes.primary) {
    await Textile.cafes.register(cafes.primary.url, token)
  }
  if (cafes.secondary) {
    await Textile.cafes.register(cafes.secondary.url, token)
  }
}
