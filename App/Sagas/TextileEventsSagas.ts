import { all, call, put, take, select } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import StorageActions from '../Redux/StorageRedux'
import {PreferencesSelectors} from '../Redux/PreferencesRedux'
import AccountActions from '../Redux/AccountRedux'
import MigrationActions from '../Redux/MigrationRedux'
import TextileEventsActions from '../Redux/TextileEventsRedux'
import RNPushNotification from 'react-native-push-notification'
import { RootAction } from '../Redux/Types'
import Textile, {
  ContactInfo
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

export function * refreshMessages () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileEventsActions.refreshMessagesRequest> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.refreshMessagesRequest)
        )
      yield call(Textile.checkCafeMessages)
      yield call(logNewEvent, 'refreshMessages', action.type)
    } catch (error) {
      // handle errors
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

      const profileResult: ContactInfo = yield call(Textile.profile)
      yield put(AccountActions.refreshProfileSuccess(profileResult))

      yield call(logNewEvent, 'refreshMessages', action.type)
    } catch (error) {
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

      yield call(Textile.addThreadIgnore, action.payload.blockId)

      yield call(logNewEvent, 'ignoreFile', action.type)
    } catch (error) {
      // handle error
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

      if (yield select(PreferencesSelectors.verboseUi)) {
        yield call(displayNotification, 'App State Change: ' + action.payload.newState)
      }

      yield call(logNewEvent, 'State Change', action.payload.newState)

      const nodeState = yield call(AsyncStorage.getItem, '@textile/nodeState')
      yield call(logNewEvent, '@textile/nodeState', nodeState)
      const appState = yield call(AsyncStorage.getItem, '@textile/appState')
      yield call(logNewEvent, '@textile/appState', appState)
      const nodeOnline = yield call(AsyncStorage.getItem, '@textile/nodeOnline')
      yield call(logNewEvent, '@textile/nodeOnline', nodeOnline)
    } catch (error) {
      // handle errors
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

      // Check for new photos on every online event
      yield put(StorageActions.refreshLocalImagesRequest())

      const pending: string | undefined = yield select((state: RootState) => state.account.avatar.pending)
      if (pending) {
        yield call(Textile.setAvatar, pending)
      }

      // Only run this after everything else in the node is running
      yield put(MigrationActions.requestRunRecurringMigrationTasks())

      yield call(logNewEvent, 'Node is:', 'online')
    } catch (error) {
      // handle errors
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
      // handle errors
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
      const action: ActionType<typeof TextileEventsActions.stopNodeAfterDelayCancelled> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.stopNodeAfterDelayCancelled)
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
      const action: ActionType<typeof TextileEventsActions.stopNodeAfterDelayFinishing> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.stopNodeAfterDelayFinishing)
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
      const action: ActionType<typeof TextileEventsActions.stopNodeAfterDelayComplete> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.stopNodeAfterDelayComplete)
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
      const action: ActionType<typeof TextileEventsActions.newErrorMessage> =
        yield take((action: RootAction) =>
          action.type === getType(TextileEventsActions.newErrorMessage)
        )

      if (yield select(PreferencesSelectors.verboseUi)) {
        yield call(displayNotification, action.payload.type, action.payload.message)
      }
      yield call(logNewEvent, action.payload.type, action.payload.message, true)
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
