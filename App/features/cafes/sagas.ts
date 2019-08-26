import { all, takeEvery, put, call, select, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import Textile, {
  ICafeSessionList,
  IFilesList,
  IContact
} from '@textile/react-native-sdk'

import { RootState } from '../../Redux/Types'
import PreferencesActions from '../../Redux/PreferencesRedux'
import * as actions from './actions'
import { makeCafeForPeerId, knownCafesMap } from './selectors'
import { Cafe, cafes } from './models'
import TextileEventsActions from '../../Redux/TextileEventsRedux'
import { logNewEvent } from '../../Sagas/DeviceLogs'
import { Alert, NativeModules, Platform } from 'react-native'
import { accountSelectors } from '../account'

// https://bitfactor.fi/en/blog/2016/12/28/ios-vs-android-bluetooth-le-overview/
const { Nearby } = NativeModules
// const { CoreBluetooth } = NativeModules

export async function init(name: string, address: string, avatar: string): Promise<void> {
  console.log('Multipeer power')
  console.log(Nearby)
  if (Platform.OS !== 'ios') {
    const answer = await Nearby.init(name, address, avatar)
    console.log('Multipeer answer', answer)
  } else {
    const answer = await Nearby.init(name, address, avatar)
    console.log('Multipeer Nearby', answer)
    await Nearby.scan()
    // await Nearby.advertise()
  }
  return
}

function *testMultipeer() {
  const name = yield select((state: RootState) =>
    accountSelectors.getUsername(state.account)
  )
  const address = yield select((state: RootState) =>
    accountSelectors.getAddress(state.account)
  )
  const profile: IContact = yield select((state: RootState) =>
    accountSelectors.getProfile(state.account)
  )
  console.log(name, address, profile.avatar)
  yield call(init, name, address, profile.avatar)
  console.log('Multipeer success')
}

function* onNodeStarted() {
  while (
    yield take([
      getType(TextileEventsActions.nodeStarted),
      getType(PreferencesActions.onboardingSuccess)
    ])
  ) {
    try {
      yield call(testMultipeer)


      yield put(actions.getCafeSessions.request())
    } catch (error) {
      // nothing to do here for now
    }
  }
}

export function showPrompt(title: string, description: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    Alert.alert(
      title,
      description,
      [
        {
          text: 'Continue',
          onPress: resolve
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: reject
        }
      ],
      { cancelable: false }
    )
  })
}

/**
 * If users join cafes late in their use of the app, they could be hit by a bit upload
 * job all at once. This just let's them in on the risk.
 */
function* confirmCafeChanges(title: string, description: string) {
  try {
    const existingFiles: IFilesList = yield call(Textile.files.list, '', '', 15)
    if (existingFiles.items.length < 10) {
      // don't bug early users
      return true
    }
    yield call(showPrompt, title, description)
    return true
  } catch (error) {
    return false
  }
}

function* registerCafe(
  action: ActionType<typeof actions.registerCafe.request>
) {
  const { url, peerId, token, success } = action.payload
  try {
    const confirmed = yield call(
      confirmCafeChanges,
      'Connect',
      'It looks like you already have some photos. The first time you invite this bot, it will upload encrypted copies of your existing groups so you can recover them later. The upload happens faster, with good WiFi or cell connection.'
    )
    if (!confirmed) {
      yield put(
        actions.registerCafe.failure({ peerId, error: {}, cancelled: true })
      )
      return
    }
    yield call(Textile.cafes.register, url, token)
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
    const confirmed = yield call(
      confirmCafeChanges,
      'Disconnect',
      "It looks like you already have some photos. If you remove this bot your remote backups will be lost. To recreate them, you'll need to upload all your local photos again in the future"
    )
    if (!confirmed) {
      yield put(
        actions.deregisterCafe.failure({ peerId, error: {}, cancelled: true })
      )
      return
    }

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
        const cafes = yield select((state: RootState) =>
          knownCafesMap(state.cafes)
        )
        const cafe = cafes[peerId]
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
        yield call(Textile.cafes.register, cafe.url, token)
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
      const sessionsList: ICafeSessionList = yield call(Textile.cafes.sessions)
      for (const session of sessionsList.items) {
        const now = new Date()
        const exp = Textile.util.timestampToDate(session.exp)
        if (exp <= now) {
          yield put(
            actions.refreshCafeSession.request({
              peerId: session.cafe.peer
            })
          )
        }
      }
    } catch (error) {}
  }
}

function* migrateUSW() {
  while (yield take([getType(TextileEventsActions.nodeOnline)])) {
    try {
      // Old us-west
      const usw = '12D3KooWSsM117bNw6yu1auMfNqeu59578Bct5V4S9fWxavogrsw'
      // New us-west
      const repl = '12D3KooWSdGmRz5JQidqrtmiPGVHkStXpbSAMnbCcW8abq6zuiDP'

      const list: ICafeSessionList = yield call(Textile.cafes.sessions)
      const peerIDs = list.items.map(session => session.cafe.peer)

      const old = list.items.find(session => session.cafe.peer === usw)
      if (old) {
        // Use the existing route to deregister the usw cafe
        yield put(actions.deregisterCafe.request({ peerId: usw }))
        // Only replace it if there wasn't an existing secondary
        if (peerIDs.length < 2) {
          const cafes = yield select((state: RootState) =>
            knownCafesMap(state.cafes)
          )
          const cafe = cafes[repl]

          if (cafe) {
            yield put(
              actions.registerCafe.request({
                url: old.cafe.url,
                peerId: repl,
                token: cafe.token
              })
            )
          }
        }
      }
    } catch (error) {
      // no error handling
    }
  }
}

function* fetchRes(url: string) {
  return yield fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
}

// Uses the gateway api to list known cafes
function* refreshKnownCafes() {
  try {
    const list: Cafe[] = cafes.map(cafe => {
      return {
        ...cafe,
        state: 'available' as
          | 'registering'
          | 'registered'
          | 'deregistering'
          | 'available'
      }
    })
    // Update our list of available cafes
    yield put(actions.getKnownCafes.success({ list }))
  } catch (error) {
    yield put(actions.getKnownCafes.failure(error))
  }
}

export default function*() {
  yield all([
    call(onNodeStarted),
    takeEvery(getType(actions.getKnownCafes.request), refreshKnownCafes),
    takeEvery(getType(actions.registerCafe.request), registerCafe),
    takeEvery(getType(actions.deregisterCafe.request), deregisterCafe),
    call(getCafeSessions),
    call(refreshExpiredSessions),
    takeEvery(getType(actions.refreshCafeSession.request), refreshCafeSession),
    call(migrateUSW)
  ])
}
