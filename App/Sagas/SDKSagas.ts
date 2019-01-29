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
import { all, call, put, select, take, takeLatest } from 'redux-saga/effects'
import {
  addThreadIgnore,
  checkCafeMessages,
  profile,
  setAvatar,
  ContactInfo
} from '@textile/react-native-sdk'
import TextileNodeActions, { TextileNodeSelectors } from '../Redux/TextileNodeRedux'
import { ActionType, getType } from 'typesafe-actions'
import { Dispatch } from 'redux'

import AccountActions from '../Redux/AccountRedux'
import MockActions from '../Redux/MockBridge'
import accountSaga from './Account'
import * as NodeLifecycle from './NodeLifecycle'
import * as NodeOnline from './NodeOnline'

export function * startSDK (dispatch: Dispatch): IterableIterator<any> {
  yield all([
    call(onNodeStarted),
    call(NodeOnline.onNodeOnline),
    call(accountSaga),
    call(NodeLifecycle.manageNode),
    call(NodeLifecycle.handleCreateNodeRequest, dispatch),
    call(refreshMessages),
    // If the user clicked any invites before creating an account, this will now flush them...
    takeLatest(getType(TextileNodeActions.nodeOnline), NodeOnline.nodeOnlineSaga),
    initializeAppState()
  ])
}
export function * backgroundFetch () {
  // yield call(logNewEvent, 'Background fetch trigger', 'Check new content')
  yield call(NodeLifecycle.startBackgroundTask)
}

export function * locationUpdate () {
  // yield call(logNewEvent, 'Location trigger', 'Check new content')
  yield call(NodeLifecycle.startBackgroundTask)
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

export function * updateAvatarAndProfile (hash: string) {
  try {
    const online: boolean = yield select(TextileNodeSelectors.online)
    if (!online) {
      yield take(getType(TextileNodeActions.nodeOnline))
    }
    yield call(setAvatar, hash)
    const profileResult: ContactInfo = yield call(profile)
    yield put(AccountActions.refreshProfileSuccess(profileResult))
  } catch (error) {
    yield put(AccountActions.profileError(error))
  }
}

function * onNodeStarted () {
  while (yield take([getType(TextileNodeActions.startNodeSuccess), getType(AccountActions.initSuccess)])) {
    try {
      // TODO: Double-check that these run fine now that they are likely called before onboarding success
      yield put(AccountActions.refreshProfileRequest())
      yield put(AccountActions.refreshPeerIdRequest())
      yield put(AccountActions.getCafeSessionsRequest())
      yield call(NodeLifecycle.getSDKVersion)
    } catch (error) {
      // nothing to do here for now
    }
  }
}

function * initializeAppState () {
  yield take(getType(TextileNodeActions.startupComplete))
  const defaultAppState = yield select(TextileNodeSelectors.appState)
  let queriedAppState = defaultAppState
  while (queriedAppState.match(/default|unknown/)) {
    yield delay(10)
    const currentAppState = yield call(() => AppState.currentState)
    queriedAppState = currentAppState || 'unknown'
  }
  yield put(TextileNodeActions.appStateChange(defaultAppState, queriedAppState))
}
