import { eventChannel } from 'redux-saga'
import { take, put, call, all } from 'redux-saga/effects'
import Textile, { EventSubscription } from '@textile/react-native-sdk'
import RNPushNotification from 'react-native-push-notification'

import * as actions from './actions'
import { NodeStatusAction } from './reducer'

function nodeEvents() {
  return eventChannel<NodeStatusAction>(emitter => {
    const subscriptions: EventSubscription[] = []
    subscriptions.push(
      Textile.events.addNodeStartedListener(() => {
        emitter(actions.nodeStarted())
      })
    )
    subscriptions.push(
      Textile.events.addNodeStoppedListener(() => {
        emitter(actions.nodeStopped())
      })
    )
    subscriptions.push(
      Textile.events.addNodeOnlineListener(() => {
        emitter(actions.nodeOnline())
      })
    )
    subscriptions.push(
      Textile.events.addNodeFailedToStartListener(error => {
        emitter(actions.nodeFailedToStart(error))
      })
    )
    subscriptions.push(
      Textile.events.addNodeFailedToStopListener(error => {
        emitter(actions.nodeFailedToStop(error))
      })
    )
    subscriptions.push(
      Textile.events.addWillStopNodeInBackgroundAfterDelayListener(delay => {
        emitter(actions.stopNodeAfterDelayStarting(delay))
      })
    )
    subscriptions.push(
      Textile.events.addCanceledPendingNodeStopListener(() => {
        emitter(actions.stopNodeAfterDelayCancelled())
      })
    )
    return () => {
      for (const subscription of subscriptions) {
        subscription.cancel()
      }
    }
  })
}

function* handleNodeEvents() {
  const chan = yield call(nodeEvents)
  try {
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      const action = yield take(chan)
      yield put(action)
    }
  } finally {
    // should never terminate
  }
}

function displayNotification(message: string, title?: string) {
  RNPushNotification.localNotification({
    title,
    message,
    playSound: false,
    vibrate: false
  })
}

export default function*() {
  yield all([handleNodeEvents])
}
