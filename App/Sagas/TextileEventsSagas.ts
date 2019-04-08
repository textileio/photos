import { all, call, put, take, select } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import StorageActions from '../Redux/StorageRedux'
import {PreferencesSelectors} from '../Redux/PreferencesRedux'
import AccountActions from '../Redux/AccountRedux'
import TextileEventsActions from '../Redux/TextileEventsRedux'
import RNPushNotification from 'react-native-push-notification'
import { RootAction } from '../Redux/Types'
import Textile, {
  API,
  pb,
  BackgroundTask
 } from '@textile/react-native-sdk'
import { logNewEvent } from './DeviceLogs'
import { pendingInvitesTask, cameraRollThreadCreateTask } from './ThreadsSagas'
import { RootState } from '../Redux/Types'
import { AsyncStorage } from 'react-native'

export function * startSagas () {
  yield all([
    call(appStateChange),
    call(startNodeFinished),
    call(stopNodeAfterDelayStarting),
    call(stopNodeAfterDelayCancelled),
    call(stopNodeAfterDelayFinishing),
    call(stopNodeAfterDelayComplete),
    call(updateProfile),
    call(refreshMessages),
    call(ignoreFileRequest),
    call(nodeOnline),
    call(newError)
  ])
}

export function * runBackgroundUpdate () {
  yield call(BackgroundTask)
}

export function * refreshMessages () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.refreshMessagesRequest> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.refreshMessagesRequest)
        )
      yield call(API.cafes.checkMessages)
      yield call(logNewEvent, 'refreshMessages', action.type)
    } catch (error) {
      yield call(logNewEvent, 'refreshMessages', error.message, true)
    }
  }
}

export function * updateProfile () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.updateProfile> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.updateProfile)
        )

      const profileResult: pb.IContact = yield call(API.profile.get)
      yield put(AccountActions.refreshProfileSuccess(profileResult))

      yield call(logNewEvent, 'refreshMessages', action.type)
    } catch (error) {
      yield call(logNewEvent, 'updateProfile', error.message, true)
      yield put(AccountActions.profileError(error))
    }
  }
}

export function * ignoreFileRequest () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.ignoreFileRequest> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.ignoreFileRequest)
        )

      yield call(API.ignores.add, action.payload.blockId)

      yield call(logNewEvent, 'ignoreFile', action.type)
    } catch (error) {
      yield call(logNewEvent, 'ignoreFileRequest', error.message, true)
    }
  }
}

export function * appStateChange () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.appStateChange> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.appStateChange)
        )

      if (yield select(PreferencesSelectors.showNodeStateNotification)) {
        yield call(displayNotification, 'App State Change: ' + action.payload.newState)
      }

      yield call(logNewEvent, 'State Change', action.payload.newState)
    } catch (error) {
      yield call(logNewEvent, 'appStateChange', error.message, true)
    }
  }
}
export function * nodeOnline () {
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

      const pending: string | undefined = yield select((state: RootState) => state.account.avatar.pending)
      if (pending) {
        yield call(API.profile.setAvatar, pending)
      }
    } catch (error) {
      yield call(logNewEvent, 'nodeOnline', error.message, true)
    }
  }
}

export function * startNodeFinished () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.startNodeFinished> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.startNodeFinished)
        )

      // Handle any pending invites now that we are finished
      yield call(pendingInvitesTask)
      yield call(cameraRollThreadCreateTask)

    } catch (error) {
      yield call(logNewEvent, 'startNodeFinished', error.message, true)
    }
  }
}

export function * stopNodeAfterDelayStarting () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.stopNodeAfterDelayStarting> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.stopNodeAfterDelayStarting)
        )

      if (yield select(PreferencesSelectors.showNodeStateNotification)) {
        yield call(displayNotification, 'Running the node for 20 sec. in the background')
      }
    } catch (error) {
      yield call(logNewEvent, 'stopNodeAfterDelayStarting', error.message, true)
    }
  }
}

export function * stopNodeAfterDelayCancelled () {
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
export function * stopNodeAfterDelayFinishing () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.stopNodeAfterDelayFinishing> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.stopNodeAfterDelayFinishing)
        )

      if (yield select(PreferencesSelectors.showNodeStateNotification)) {
        yield call(displayNotification, 'Stopping node')
      }
    } catch (error) {
      yield call(logNewEvent, 'stopNodeAfterDelayFinishing', error.message, true)
    }
  }
}
export function * stopNodeAfterDelayComplete () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.stopNodeAfterDelayComplete> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.stopNodeAfterDelayComplete)
        )

      if (yield select(PreferencesSelectors.showNodeStateNotification)) {
        yield call(displayNotification, 'Node stopped')
      }
    } catch (error) {
      yield call(logNewEvent, 'stopNodeAfterDelayComplete', error.message, true)
    }
  }
}
export function * newError () {
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

function displayNotification (message: string, title?: string) {
  RNPushNotification.localNotification({
    title,
    message,
    playSound: false,
    vibrate: false
  })
}
