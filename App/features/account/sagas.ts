import {
  take,
  put,
  call,
  all,
  select,
  fork,
  takeEvery
} from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import Textile, {
  IContact,
  ICafeSession,
  ICafeSessionList
} from '@textile/react-native-sdk'

import * as actions from './actions'
import { contactsActions } from '../../features/contacts'
import PhotoViewingActions from '../../Redux/PhotoViewingRedux'
import PreferencesActions from '../../Redux/PreferencesRedux'
import TextileEventsActions, {
  TextileEventsSelectors
} from '../../Redux/TextileEventsRedux'
import { logNewEvent } from '../../Sagas/DeviceLogs'
import * as CameraRoll from '../../Services/CameraRoll'
import { SharedImage } from '../group/add-photo/models'
import { cafesMap } from '../../Models/cafes'

function* onNodeStarted() {
  while (
    yield take([
      getType(TextileEventsActions.nodeStarted),
      getType(PreferencesActions.onboardingSuccess)
    ])
  ) {
    yield call(logNewEvent, 'nodeStarted', 'refresh account data')
    try {
      yield put(actions.refreshProfileRequest())
      yield put(actions.refreshPeerIdRequest())
      yield put(actions.refreshAddressRequest())
      yield put(actions.getCafeSessions.request())
      yield put(contactsActions.getContactsRequest())
      yield put(PhotoViewingActions.refreshThreadsRequest())
    } catch (error) {
      // nothing to do here for now
    }
  }
}

export function* chooseProfilePhoto() {
  try {
    const result: { image: CameraRoll.IPickerImage; data: string } = yield call(
      CameraRoll.chooseProfilePhoto
    )
    const image: SharedImage = {
      isAvatar: true,
      origURL: result.image.origURL,
      uri: result.image.uri,
      path: result.image.path,
      canDelete: result.image.canDelete
    }
    yield put(actions.chooseProfilePhoto.success({ image, data: result.data }))
  } catch (error) {
    yield put(actions.chooseProfilePhoto.failure(error))
  }
}

function* refreshProfile() {
  while (true) {
    try {
      yield take(getType(actions.refreshProfileRequest))
      const profileResult: IContact | undefined = yield call(
        Textile.account.contact
      )
      if (profileResult) {
        yield put(actions.refreshProfileSuccess(profileResult))
      }
    } catch (error) {
      yield call(logNewEvent, 'refreshProfile', error.message, true)
      yield put(actions.profileError(error))
    }
  }
}

function* refreshPeerId() {
  while (true) {
    try {
      yield take(getType(actions.refreshPeerIdRequest))
      const peerIdResult = yield call(Textile.ipfs.peerId)
      yield put(actions.refreshPeerIdSuccess(peerIdResult))
    } catch (error) {
      yield put(actions.refreshPeerIdError(error))
    }
  }
}

function* refreshAddress() {
  while (true) {
    try {
      yield take(getType(actions.refreshAddressRequest))
      const addressResult = yield call(Textile.account.address)
      yield put(actions.refreshAddressSuccess(addressResult))
    } catch (error) {
      yield put(actions.refreshAddressError(error))
    }
  }
}

function* setUsername() {
  while (true) {
    try {
      const action: ActionType<typeof actions.setUsernameRequest> = yield take(
        getType(actions.setUsernameRequest)
      )
      const started = yield select(TextileEventsSelectors.started)
      if (!started) {
        yield take(getType(TextileEventsActions.nodeStarted))
      }
      // Ideally this could move into the SDK directly so it can manage
      // knowing its own online state
      yield call(Textile.profile.setName, action.payload.username)
      yield put(actions.refreshProfileRequest())
    } catch (error) {
      yield put(actions.profileError(error))
    }
  }
}

function* setAvatar() {
  while (true) {
    try {
      const action: ActionType<typeof actions.setAvatar.request> = yield take(
        getType(actions.setAvatar.request)
      )
      const started = yield select(TextileEventsSelectors.started)
      if (!started) {
        yield take(getType(TextileEventsActions.nodeStarted))
      }
      yield call(Textile.profile.setAvatar, action.payload.path)
      yield put(actions.refreshProfileRequest())
      yield put(actions.setAvatar.success())
    } catch (error) {
      yield put(actions.setAvatar.failure(error))
    }
  }
}

function* getCafeSessions() {
  while (true) {
    try {
      yield take(getType(actions.getCafeSessions.request))
      const list: ICafeSessionList = yield call(Textile.cafes.sessions)
      yield put(actions.getCafeSessions.success({ sessions: list.items }))
    } catch (error) {
      yield call(logNewEvent, 'getCafeSessions', error.message, true)
      yield put(actions.getCafeSessions.failure({ error }))
    }
  }
}

function* refreshCafeSession(
  action: ActionType<typeof actions.refreshCafeSession.request>
) {
  const { peerId } = action.payload
  try {
    const session = yield call(Textile.cafes.refreshSession, peerId)
    if (session) {
      yield put(actions.refreshCafeSession.success({ session }))
    } else {
      throw new Error('session not found')
    }
  } catch (error) {
    const message =
      (error.message as string) || (error as string) || 'unknown error'
    if (message === 'unauthorized') {
      try {
        const cafe = cafesMap[peerId]
        if (!cafe) {
          throw new Error('need to re-register cafe, but have no cafe info')
        }
        yield call(Textile.cafes.register, cafe.peerId, cafe.token)
      } catch (error) {
        yield put(actions.refreshCafeSession.failure({ peerId, error }))
      }
    } else {
      yield put(actions.refreshCafeSession.failure({ peerId, error }))
    }
  }
}

function* refreshExpiredSessions() {
  while (yield take([getType(TextileEventsActions.nodeOnline)])) {
    try {
      const list: ICafeSessionList = yield call(Textile.cafes.sessions)
      for (const session of list.items) {
        const now = new Date()
        const exp = Textile.util.timestampToDate(session.exp)
        if (exp <= now) {
          yield put(
            actions.refreshCafeSession.request({ peerId: session.cafe.peer })
          )
        }
      }
    } catch (error) {}
  }
}

export default function*() {
  yield all([
    call(onNodeStarted),
    call(refreshProfile),
    call(refreshPeerId),
    call(refreshAddress),
    call(setUsername),
    call(setAvatar),
    call(getCafeSessions),
    call(refreshExpiredSessions),
    takeEvery(getType(actions.refreshCafeSession.request), refreshCafeSession),
    takeEvery(getType(actions.chooseProfilePhoto.request), chooseProfilePhoto)
  ])
}
