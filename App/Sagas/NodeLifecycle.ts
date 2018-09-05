import { delay } from 'redux-saga'
import { take, call, put, fork, cancelled, race, select } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import RNFS from 'react-native-fs'
import Config from 'react-native-config'
import BackgroundTimer from 'react-native-background-timer'
import PushNotification from 'react-native-push-notification'

import TextileNodeActions, { NodeState, TextileNodeSelectors } from '../Redux/TextileNodeRedux'
import { PreferencesSelectors } from '../Redux/PreferencesRedux'
import TextileNode from '../../TextileNode'
import { RootAction } from '../Redux/Types'
import { Threads, ThreadName } from '../Models/TextileTypes'

export function * manageNode () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileNodeActions.appStateChange> =
        yield take((action: RootAction) =>
          action.type === getType(TextileNodeActions.appStateChange) && (action.payload.newState === 'active' || action.payload.newState === 'background')
        )

      if (yield select(PreferencesSelectors.verboseUi)) {
        yield call(displayNotification, 'App State Change: ' + action.payload.newState)
      }

      // Get our current node state and create/start the node if it isn't started
      // Use fork so we don't block listening for the next app state change while the node is created and started
      const nodeState: NodeState = yield select(TextileNodeSelectors.nodeState)
      if (nodeState !== NodeState.started) {
        if (yield select(PreferencesSelectors.verboseUi)) {
          yield call(displayNotification, 'Starting node')
        }
        yield fork(createAndStartNode)
      }

      // If we got a background app state, start a background task and schedule the node to be stopped in 20 seconds
      //
      // This background state can come from a active > background transition
      // or by launching into the background because of a trigger.
      //
      // Using the race effect, if we get a foreground event while we're waiting
      // to stop the node, cancel the stop and let it keep running
      if (action.payload.newState === 'background') {
        BackgroundTimer.start()
        // This race cancels whichever effect looses the race, so a foreground event will cancel stopping the node
        yield race({
          delayAndStopNode: call(stopNodeAfterDelay, 20000),
          foregroundEvent: take(
            (action: RootAction) =>
              action.type === getType(TextileNodeActions.appStateChange) && action.payload.newState === 'active'
          )
        })
        BackgroundTimer.stop()
      }
    } catch (error) {
      if (yield select(PreferencesSelectors.verboseUi)) {
        yield call(displayNotification, error, 'Error')
      }
      yield put(TextileNodeActions.nodeError(error))
    }
  }
}

function * createAndStartNode () {
  const logLevel = (__DEV__ ? 'DEBUG' : 'INFO')
  const logFiles = !__DEV__
  yield put(TextileNodeActions.creatingNode())
  yield call(TextileNode.create, RNFS.DocumentDirectoryPath, Config.TEXTILE_CAFE_URI, logLevel, logFiles)
  yield put(TextileNodeActions.createNodeSuccess())
  yield put(TextileNodeActions.startingNode())
  yield call(TextileNode.start)
  const threads: Threads = yield call(TextileNode.threads)
  const defaultThread = threads.items.find(thread => thread.name === 'default')
  if (!defaultThread) {
    yield call(TextileNode.addThread, 'default' as ThreadName)
  }
  yield put(TextileNodeActions.startNodeSuccess())
}

function * stopNodeAfterDelay (ms: number) {
  try {
    if (yield select(PreferencesSelectors.verboseUi)) {
      yield call(displayNotification, 'Running the node for 20 sec. in the background')
    }
    yield delay(ms)
  } finally {
    if (yield cancelled()) {
      // Let it keep running
      if (yield select(PreferencesSelectors.verboseUi)) {
        yield call(displayNotification, 'Delayed stop of node canceled because of foreground event')
      }
    } else {
      if (yield select(PreferencesSelectors.verboseUi)) {
        yield call(displayNotification, 'Stopping node')
      }
      yield put(TextileNodeActions.stoppingNode())
      yield call(TextileNode.stop)
      if (yield select(PreferencesSelectors.verboseUi)) {
        yield call(displayNotification, 'Node stopped')
      }
      yield put(TextileNodeActions.stopNodeSuccess())
      yield delay(500)
    }
  }
}

function displayNotification (message: string, title?: string) {
  PushNotification.localNotification({
    title,
    message,
    playSound: false,
    vibrate: false
  })
}
