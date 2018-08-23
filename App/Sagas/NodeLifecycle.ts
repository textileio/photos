import { Action } from 'redux'
import { delay } from 'redux-saga'
import { take, call, put, fork, cancelled, race } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import RNFS from 'react-native-fs'
import Config from 'react-native-config'

import TextileNodeActions from '../Redux/TextileNodeRedux'
import TextileNode from '../../TextileNode'
import { RootAction } from '../Redux/Types'

export function * manageNode () {
  yield fork(createAndStartNode)
  while (true) {
    const action: ActionType<typeof TextileNodeActions.appStateChange> = yield take(getType(TextileNodeActions.appStateChange))
    if (action.payload.newState === 'background') {
      // This race cancels whichever effect looses the race, so a foreground event will cancel stopping the node
      yield race({
        delayAndStopNode: call(stopNodeAfterDelay, 20000),
        foregroundEvent: take(
          (action: RootAction) =>
            action.type === getType(TextileNodeActions.appStateChange) && action.payload.newState === 'active'
        )
      })
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
  try {
    yield call(delay, ms)
  } finally {
    if (yield cancelled()) {
      // Let it keep running
    } else {
      yield call(TextileNode.stop)
    }
  }
}
