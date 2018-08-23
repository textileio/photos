import { delay } from 'redux-saga'
import { take, call, put, fork, cancelled, race, select } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import RNFS from 'react-native-fs'
import Config from 'react-native-config'
import BackgroundTimer from 'react-native-background-timer'

import TextileNodeActions, { TextileNodeSelectors, NodeState } from '../Redux/TextileNodeRedux'
import TextileNode from '../../TextileNode'
import { RootAction } from '../Redux/Types'

export function * manageNode () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileNodeActions.appStateChange> =
        yield take((action: RootAction) =>
          action.type === getType(TextileNodeActions.appStateChange) && (action.payload.newState === 'active' || action.payload.newState === 'background')
        )
      console.log('GOT APP STATE:', action.payload.newState)

      // Get our current node state and create/start the node if it doesn't exist or is stopped
      // Use fork so we don't block listening for the next app state change while the node is created and started
      const nodeState: NodeState = yield select(TextileNodeSelectors.nodeState)
      console.log('CURRENT NODE STATE:', nodeState)
      if (nodeState === NodeState.nonexistent || nodeState === NodeState.stopped) {
        console.log('CREATING/STARTING NODE')
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
  yield put(TextileNodeActions.startNodeSuccess())
}

function * stopNodeAfterDelay (ms: number) {
  console.log('RUNNING FOR MS:', ms)
  try {
    yield delay(ms)
    console.log('DELAY OVER')
  } finally {
    if (yield cancelled()) {
      // Let it keep running
      console.log('SHUT DOWN CANCELLED, STILL RUNNING')
    } else {
      console.log('STOPPING NODE')
      yield put(TextileNodeActions.stoppingNode())
      yield call(TextileNode.stop)
      yield put(TextileNodeActions.stopNodeSuccess())
    }
  }
}
