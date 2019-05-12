import { all, call, put, take, select } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import StorageActions from '../Redux/StorageRedux'
import {PreferencesSelectors} from '../Redux/PreferencesRedux'
import { accountActions } from '../features/account'
import TextileEventsActions from '../Redux/TextileEventsRedux'
import RNPushNotification from 'react-native-push-notification'
import { RootAction, RootState } from '../Redux/Types'
import Textile, {
  IContact
 } from '@textile/react-native-sdk'
import { logNewEvent } from './DeviceLogs'
import { pendingInvitesTask, cameraRollThreadCreateTask } from './ThreadsSagas'

export function * startSagas() {
  yield all([
    call(initializeTextile),
    call(startNodeFinished),
    call(stopNodeAfterDelayStarting),
    call(stopNodeAfterDelayCancelled),
    call(stopNodeAfterDelayComplete),
    call(refreshMessages),
    call(ignoreFileRequest),
    call(nodeOnline),
    call(newError)
  ])
}

// export function * runBackgroundUpdate() {
  // This used to be some exported function from the SDK
  // TODO: Remove all this, make sure background triggers are handled in native SDKs
  // yield call(BackgroundTask)
// }

function * initializeTextile() {
  try {
    const phrase: string | undefined = yield call(Textile.initialize, false, false)
    if (phrase) {
      yield put(accountActions.setRecoveryPhrase(phrase))
    }
  } catch (error) {
    yield put(TextileEventsActions.failedToInitializeNode(error))
  }
}

export function * refreshMessages() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.refreshMessagesRequest> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.refreshMessagesRequest)
        )
      yield call(Textile.cafes.checkMessages)
      yield call(logNewEvent, 'refreshMessages', action.type)
    } catch (error) {
      yield call(logNewEvent, 'refreshMessages', error.message, true)
    }
  }
}

export function * ignoreFileRequest() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.ignoreFileRequest> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.ignoreFileRequest)
        )

      yield call(Textile.ignores.add, action.payload.blockId)

      yield call(logNewEvent, 'ignoreFile', action.type)
    } catch (error) {
      yield call(logNewEvent, 'ignoreFileRequest', error.message, true)
    }
  }
}

export function * nodeOnline() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.nodeOnline> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.nodeOnline)
        )
      yield call(logNewEvent, 'Node is:', 'online')

      // Check for new photos on every online event
      yield put(StorageActions.refreshLocalImagesRequest())
    } catch (error) {
      yield call(logNewEvent, 'nodeOnline', error.message, true)
    }
  }
}

export function * startNodeFinished() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.nodeStarted> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.nodeStarted)
        )

      // Handle any pending invites now that we are finished
      yield call(pendingInvitesTask)
      yield call(cameraRollThreadCreateTask)

    } catch (error) {
      yield call(logNewEvent, 'startNodeFinished', error.message, true)
    }
  }
}

export function * stopNodeAfterDelayStarting() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.stopNodeAfterDelayStarting> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.stopNodeAfterDelayStarting)
        )

      if (yield select(PreferencesSelectors.showNodeStateNotification)) {
        yield call(displayNotification, `Running the node for ${action.payload.delay} sec. in the background`)
      }
    } catch (error) {
      yield call(logNewEvent, 'stopNodeAfterDelayStarting', error.message, true)
    }
  }
}

export function * stopNodeAfterDelayCancelled() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.stopNodeAfterDelayCancelled> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.stopNodeAfterDelayCancelled)
        )

      // Let it keep running
      if (yield select(PreferencesSelectors.showNodeStateNotification)) {
        yield call(displayNotification, 'Delayed stop of node canceled because of foreground event')
      }

      // Check for new photos in case user left app and came back after taking one
      yield put(StorageActions.refreshLocalImagesRequest())

    } catch (error) {
      yield call(logNewEvent, 'stopNodeAfterDelayCancelled', error.message, true)
    }
  }
}

export function * stopNodeAfterDelayComplete() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.nodeStopped> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.nodeStopped)
        )

      if (yield select(PreferencesSelectors.showNodeStateNotification)) {
        yield call(displayNotification, 'Node stopped')
      }
    } catch (error) {
      yield call(logNewEvent, 'stopNodeAfterDelayComplete', error.message, true)
    }
  }
}

export function * newError() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.newErrorMessage> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.newErrorMessage)
        )
      if (yield select(PreferencesSelectors.showNodeErrorNotification)) {
        yield call(displayNotification, action.payload.type, action.payload.message)
      }
      yield call(logNewEvent, action.payload.type, action.payload.message, true)
    } catch (error) {
      yield call(logNewEvent, 'newError error', error.message, true)
    }
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
