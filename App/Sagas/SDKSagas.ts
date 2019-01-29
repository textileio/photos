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
  checkCafeMessages,
  addThreadIgnore
} from '@textile/react-native-sdk'
import TextileNodeActions, { TextileNodeSelectors } from '../Redux/TextileNodeRedux'
import { ActionType, getType } from 'typesafe-actions'
import { Dispatch } from 'redux'

import accountSaga from './Account'
import * as NodeLifecycle from './NodeLifecycle'
import * as NodeStarted from './NodeStarted'
import * as NodeOnline from './NodeOnline'

export function * startSDK (dispatch: Dispatch): IterableIterator<any> {
  yield all([
    call(NodeStarted.onNodeStarted),
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

export function * initializeAppState () {
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
