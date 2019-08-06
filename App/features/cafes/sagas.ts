import { all, takeEvery, put, call, select, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import Textile, {
  ICafeSessionList,
  ICafeSession
} from '@textile/react-native-sdk'

import { RootState } from '../../Redux/Types'
import PreferencesActions from '../../Redux/PreferencesRedux'
import * as actions from './actions'
import { sessions, makeCafeForPeerId } from './selectors'
import { Cafe, Cafes } from './models'
import TextileEventsActions from '../../Redux/TextileEventsRedux'
import { cafesMap } from '../../Models/cafes'
import { logNewEvent } from '../../Sagas/DeviceLogs'

function* onNodeStarted() {
  while (
    yield take([
      getType(TextileEventsActions.nodeStarted),
      getType(PreferencesActions.onboardingSuccess)
    ])
  ) {
    try {
      yield put(actions.getCafeSessions.request())
    } catch (error) {
      // nothing to do here for now
    }
  }
}

function* registerCafe(
  action: ActionType<typeof actions.registerCafe.request>
) {
  const { peerId, token, success } = action.payload
  try {
    yield call(Textile.cafes.register, peerId, token)
    yield put(actions.registerCafe.success(peerId))
    yield put(actions.getCafeSessions.request())
    if (success) {
      yield call(success)
    }
  } catch (error) {
    yield put(actions.registerCafe.failure({ peerId, error }))
  }
}

function* deregisterCafe(
  action: ActionType<typeof actions.deregisterCafe.request>
) {
  const { peerId, success } = action.payload
  try {
    yield call(Textile.cafes.deregister, peerId)
    yield put(actions.deregisterCafe.success(peerId))
    yield put(actions.getCafeSessions.request())
    if (success) {
      yield call(success)
    }
  } catch (error) {
    yield put(actions.deregisterCafe.failure({ peerId, error }))
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
        let token: string | undefined
        // try to get the cafe token from static cafes bundled with the app
        const cafe = cafesMap[peerId]
        if (cafe) {
          token = cafe.token
        } else {
          // if not, try to get the token from persisted data about registered cafes
          const cafe: Cafe = yield select((state: RootState) =>
            makeCafeForPeerId(peerId)(state.cafes)
          )
          token = cafe.token
        }
        if (!token) {
          throw new Error('need to re-register cafe, but have no cafe token')
        }
        yield call(Textile.cafes.register, peerId, token)
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
      const sessionsList: ICafeSession[] = yield select((state: RootState) =>
        sessions(state.cafes)
      )
      for (const session of sessionsList) {
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

function* migrateUSW() {
  // Old us-west
  const usw = '12D3KooWSsM117bNw6yu1auMfNqeu59578Bct5V4S9fWxavogrsw'
  // New us-west
  const repl = '12D3KooWSdGmRz5JQidqrtmiPGVHkStXpbSAMnbCcW8abq6zuiDP'
  const cafes: Cafes = yield select((state: RootState) => state.cafes.cafes)
  const peerIDs = Object.keys(cafes)

  if (peerIDs.indexOf(usw) > -1) {
    try {
      // Use the existing route to deregister the usw cafe
      yield put(actions.deregisterCafe.request({ peerId: usw }))
      // Only replace it if there wasn't an existing secondary
      if (peerIDs.length < 2) {
        const cafe = cafesMap[repl]
        if (cafe) {
          yield put(
            actions.registerCafe.request({ peerId: repl, token: cafe.token })
          )
        }
      }
    } catch (error) {
      // no error handling
    }
  }
}

export default function*() {
  yield all([
    call(onNodeStarted),
    takeEvery(getType(actions.registerCafe.request), registerCafe),
    takeEvery(getType(actions.deregisterCafe.request), deregisterCafe),
    call(getCafeSessions),
    call(refreshExpiredSessions),
    takeEvery(getType(actions.refreshCafeSession.request), refreshCafeSession),
    takeEvery(getType(actions.getCafeSessions.request), migrateUSW)
  ])
}
