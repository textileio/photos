import { all, call, put, take, select } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import StorageActions from '../Redux/StorageRedux'
import {PreferencesSelectors} from '../Redux/PreferencesRedux'
import ContactsActions from '../Redux/ContactsRedux'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import MockBridgeActions from '../Redux/MockBridge'
import RNPushNotification from 'react-native-push-notification'
import { RootAction } from '../Redux/Types'
import Config from 'react-native-config'
import {
  addThread,
  threads,
  ThreadInfo
 } from '@textile/react-native-sdk'
import { logNewEvent } from './DeviceLogs'
import { pendingInvitesTask } from './ThreadsSagas'

export function * mockEvents () {
  yield all([
    call(appStateChange),
    call(startNodeFinished),
    call(stopNodeAfterDelayStarting),
    call(stopNodeAfterDelayCancelled),
    call(stopNodeAfterDelayFinishing),
    call(stopNodeAfterDelayComplete),
    call(newError)
  ])
}

export function * appStateChange () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof MockBridgeActions.appStateChange> =
        yield take((action: RootAction) =>
          action.type === getType(MockBridgeActions.appStateChange)
        )

      if (yield select(PreferencesSelectors.verboseUi)) {
        yield call(displayNotification, 'App State Change: ' + action.payload.newState)
      }
      yield call(logNewEvent, 'State Change', action.payload.newState)
    } catch (error) {
      // handle errors
    }
  }
}

export function * startNodeFinished () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof MockBridgeActions.startNodeFinished> =
        yield take((action: RootAction) =>
          action.type === getType(MockBridgeActions.startNodeFinished)
        )

      // Handle any pending invites now that we are finished
      yield call(pendingInvitesTask)

      // Refresh contacts
      yield put(ContactsActions.getContactsRequest())
      // Refresh threads
      yield put(PhotoViewingActions.refreshThreadsRequest())

      // Update our camera roll
      const threadsResult: ReadonlyArray<ThreadInfo> = yield call(threads)
      const cameraRollThreadName = 'Camera Roll'
      const cameraRollThreadKey = Config.RN_TEXTILE_CAMERA_ROLL_THREAD_KEY
      const cameraRollThread = threadsResult.find((thread) => thread.key === cameraRollThreadKey)
      if (!cameraRollThread) {
        yield call(addThread, cameraRollThreadKey, cameraRollThreadName, false)
      }
    } catch (error) {
      // handle errors
    }
  }
}

export function * stopNodeAfterDelayStarting () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof MockBridgeActions.stopNodeAfterDelayStarting> =
        yield take((action: RootAction) =>
          action.type === getType(MockBridgeActions.stopNodeAfterDelayStarting)
        )

      if (yield select(PreferencesSelectors.verboseUi)) {
        yield call(displayNotification, 'Running the node for 20 sec. in the background')
      }
    } catch (error) {
      // handle errors
    }
  }
}

export function * stopNodeAfterDelayCancelled () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof MockBridgeActions.stopNodeAfterDelayCancelled> =
        yield take((action: RootAction) =>
          action.type === getType(MockBridgeActions.stopNodeAfterDelayCancelled)
        )

      // Let it keep running
      if (yield select(PreferencesSelectors.verboseUi)) {
        yield call(displayNotification, 'Delayed stop of node canceled because of foreground event')
      }

      // Check for new photos in case user left app and came back after taking one
      yield put(StorageActions.refreshLocalImagesRequest())

    } catch (error) {
      // handle errors
    }
  }
}
export function * stopNodeAfterDelayFinishing () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof MockBridgeActions.stopNodeAfterDelayFinishing> =
        yield take((action: RootAction) =>
          action.type === getType(MockBridgeActions.stopNodeAfterDelayFinishing)
        )

      if (yield select(PreferencesSelectors.verboseUi)) {
        yield call(displayNotification, 'Stopping node')
      }
    } catch (error) {
      // handle errors
    }
  }
}
export function * stopNodeAfterDelayComplete () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof MockBridgeActions.stopNodeAfterDelayComplete> =
        yield take((action: RootAction) =>
          action.type === getType(MockBridgeActions.stopNodeAfterDelayComplete)
        )

      if (yield select(PreferencesSelectors.verboseUi)) {
        yield call(displayNotification, 'Node stopped')
      }
    } catch (error) {
      // handle errors
    }
  }
}
export function * newError () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof MockBridgeActions.newErrorMessage> =
        yield take((action: RootAction) =>
          action.type === getType(MockBridgeActions.newErrorMessage)
        )

      if (yield select(PreferencesSelectors.verboseUi)) {
        yield call(displayNotification, action.payload.error, 'Error')
      }
    } catch (error) {
      // handle errors
    }
  }
}

function displayNotification (message: string, title?: string) {
  RNPushNotification.localNotification({
    title,
    message,
    playSound: false,
    vibrate: false
  })
}
