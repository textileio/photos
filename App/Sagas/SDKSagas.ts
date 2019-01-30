/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/
import { AppState } from 'react-native'
import { delay } from 'redux-saga'
import { all, call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects'
import {
  addThreadIgnore,
  checkCafeMessages,
  setAvatar,
  username
} from '@textile/react-native-sdk'
import TextileNodeActions, { TextileNodeSelectors } from '../Redux/TextileNodeRedux'
import { ActionType, getType } from 'typesafe-actions'
import { Dispatch } from 'redux'

import * as NodeLifecycle from './NodeLifecycle'
import MockBridge from '../Redux/MockBridge'
import { RootState } from '../Redux/Types'
import * as TextileEvents from '../SDK/events'
import Textile from '../SDK'

export function * startSDK (dispatch: Dispatch): IterableIterator<any> {
  yield all([
    // call(NodeLifecycle.manageNode),
    call(NodeLifecycle.handleCreateNodeRequest, dispatch),
    call(refreshMessages),
    takeLatest(getType(TextileNodeActions.nodeOnline), nodeOnlineSaga),
    takeEvery(getType(TextileNodeActions.ignoreFileRequest), ignoreFile)
    // initializeAppState()
  ])
}

export function * refreshMessages () {
  while (yield take(getType(TextileNodeActions.refreshMessagesRequest))) {
    try {
      yield call(checkCafeMessages)
      yield put(TextileNodeActions.refreshMessagesSuccess(Date.now()))
    } catch (error) {
      yield put(TextileNodeActions.refreshMessagesFailure(error))
    }
  }
}

export function * ignoreFile (action: ActionType<typeof TextileNodeActions.ignoreFileRequest>) {
  const { blockId } = action.payload
  try {
    // TODO: rewire ignore success to issue goBack in an app based saga
    // yield call(NavigationService.goBack)
    yield call(addThreadIgnore, blockId)
    yield put(TextileNodeActions.ignoreFileSuccess())
  } catch (error) {
    yield put(TextileNodeActions.ignoreFileError(error))
  }
}

export function * updateUsername (name: string) {
  yield call(username, name)
  // Setting the username makes it available in the Profile, so update it
  yield call(TextileEvents.updateProfile)
}

export function * updateAvatarAndProfile (hash: string) {
  try {
    const online: boolean = yield select(TextileNodeSelectors.online)
    if (!online) {
      yield take(getType(TextileNodeActions.nodeOnline))
    }
    yield call(setAvatar, hash)
    yield call(TextileEvents.updateProfile)
  } catch (error) {
    // TODO
  }
}

export function * waitUntilOnline(ms: number) {
  let ttw = ms
  let online = yield select(TextileNodeSelectors.online)
  while (!online && 0 < ttw) {
    yield delay(50)
    online = yield select(TextileNodeSelectors.online)
    ttw -= 50
  }
  return online
}

function * nodeOnlineSaga () {
  const online = yield select(TextileNodeSelectors.online)
  if (online) {
    yield put(MockBridge.nodeOnline())
    try {
      const pending: string | undefined = yield select((state: RootState) => state.account.avatar.pending)
      if (pending) {
        yield call(setAvatar, pending)
      }
    } catch (error) {
      // nada
    }
  }
}

// function * initializeAppState () {
//   yield take(getType(TextileNodeActions.startupComplete))
//   const defaultAppState = yield call(Textile.appState)
//   // const defaultAppState = yield select(TextileNodeSelectors.appState)
//   let queriedAppState = defaultAppState
//   while (queriedAppState.match(/default|unknown/)) {
//     yield delay(10)
//     const currentAppState = yield call(() => AppState.currentState)
//     queriedAppState = currentAppState || 'unknown'
//   }
//   yield put(TextileNodeActions.appStateChange(defaultAppState, queriedAppState))
// }
