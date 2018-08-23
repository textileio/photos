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
  yield call(TextileNode.create, RNFS.DocumentDirectoryPath, Config.TEXTILE_CAFE_URI, logLevel, logFiles)
  yield call(TextileNode.start)
}

function * startNode () {
  yield call(TextileNode.start)
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

function * runNodeQuickly () {
  try {
    yield call(TextileNode.start)
  } catch (error) {
    yield put(TextileNodeActions.startNodeFailure(error))
    return
  }
  yield delay(2000)
  const canceled = yield cancelled()
  if (!canceled) {
    try {
      yield call(TextileNode.stop)
    } catch (error) {

    }
  }
}