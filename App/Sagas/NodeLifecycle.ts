import { delay } from 'redux-saga'
import { take, call, put, fork, cancelled, race, select } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import RNFS from 'react-native-fs'
import Config from 'react-native-config'
import BackgroundTimer from 'react-native-background-timer'
import RNPushNotification from 'react-native-push-notification'

import TextileNodeActions from '../Redux/TextileNodeRedux'
import { PreferencesSelectors } from '../Redux/PreferencesRedux'
import TextileNode from '../../TextileNode'
import { RootAction } from '../Redux/Types'
import {Threads, ThreadName} from '../Models/TextileTypes'
import {logNewEvent} from './DeviceLogs'

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
      yield call(logNewEvent, 'State Change', action.payload.newState)

      // Create and start the node no matter what, even if it's already created and/or started it should be fine to call again
      // Use fork so we don't block listening for the next app state change while the node is created and started
      yield fork(createAndStartNode)

      // If we got a background app state, start a background task and schedule the node to be stopped in 20 seconds
      //
      // This background state can come from a active > background transition
      // or by launching into the background because of a trigger.
      if (action.payload.newState === 'background') {
        yield fork(backgroundTaskRace)
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
  try {
    const logLevel = (__DEV__ ? 'DEBUG' : 'INFO')
    const logFiles = !__DEV__
    yield put(TextileNodeActions.creatingNode())
    yield call(TextileNode.create, RNFS.DocumentDirectoryPath, Config.TEXTILE_CAFE_URI, logLevel, logFiles)
    yield put(TextileNodeActions.createNodeSuccess())
    yield put(TextileNodeActions.startingNode())
    yield call(TextileNode.start)
    const threads: Threads = yield call(TextileNode.threads)
    const defaultThread = threads.items.find((thread) => thread.name === 'default')
    if (!defaultThread) {
      yield call(TextileNode.addThread, 'default' as ThreadName)
    }
    yield put(TextileNodeActions.startNodeSuccess())
  } catch (error) {
    yield put(TextileNodeActions.nodeError(error))
  }
}

function * backgroundTaskRace () {
  // This race cancels whichever effect looses the race, so a foreground event will cancel stopping the node
  //
  // Using the race effect, if we get a foreground event while we're waiting
  // to stop the node, cancel the stop and let it keep running
  BackgroundTimer.start()
  yield race({
    delayAndStopNode: call(stopNodeAfterDelay, 20000),
    foregroundEvent: take(
      (action: RootAction) =>
        action.type === getType(TextileNodeActions.appStateChange) && action.payload.newState === 'active'
    )
  })
  BackgroundTimer.stop()
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

export function * backgroundTask () {
  yield call(logNewEvent, 'Background trigger', 'Check new content')
}

export function * locationUpdate () {
  yield call(logNewEvent, 'Location trigger', 'Check new content')
}

function displayNotification (message: string, title?: string) {
  RNPushNotification.localNotification({
    title,
    message,
    playSound: false,
    vibrate: false
  })
}
