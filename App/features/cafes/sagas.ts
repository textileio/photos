import { all, takeEvery, put, call, select, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import Textile, {
  ICafeSessionList,
  ICafeSession
} from '@textile/react-native-sdk'

import { RootState } from '../../Redux/Types'
import PreferencesActions from '../../Redux/PreferencesRedux'
import * as actions from './actions'
import { sessions } from './selectors'
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
  const { id, success } = action.payload
  try {
    yield call(Textile.cafes.deregister, id)
    yield put(actions.deregisterCafe.success(id))
    yield put(actions.getCafeSessions.request())
    if (success) {
      yield call(success)
    }
  } catch (error) {
    yield put(actions.deregisterCafe.failure({ id, error }))
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

export default function*() {
  yield all([
    call(onNodeStarted),
    takeEvery(getType(actions.registerCafe.request), registerCafe),
    takeEvery(getType(actions.deregisterCafe.request), deregisterCafe),
    call(getCafeSessions),
    call(refreshExpiredSessions),
    takeEvery(getType(actions.refreshCafeSession.request), refreshCafeSession)
  ])
}
