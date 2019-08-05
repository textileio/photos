/* eslint camelcase: 0 */
import { eventChannel } from 'redux-saga'
import { all, call, put, take, select } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import RNPushNotification from 'react-native-push-notification'
import Textile, {
  EventSubscription,
  FeedItemType
} from '@textile/react-native-sdk'
import Long from 'long'

import { toTypedNotification } from '../Services/Notifications'
import { logNewEvent } from './DeviceLogs'
import { pendingInvitesTask, cameraRollThreadCreateTask } from './ThreadsSagas'
import { PreferencesSelectors } from '../Redux/PreferencesRedux'
import { RootAction } from '../Redux/Types'
import { accountActions } from '../features/account'
import TextileEventsActions, {
  TextileEventsAction
} from '../Redux/TextileEventsRedux'
import NotificationActions, {
  NotificationsAction
} from '../Redux/NotificationsRedux'
import GroupsActions, { GroupsAction } from '../Redux/GroupsRedux'
import { contactsActions, ContactsAction } from '../features/contacts'
import DeviceLogsActions, { DeviceLogsAction } from '../Redux/DeviceLogsRedux'
import { groupActions, GroupAction } from '../features/group'
import AppConfig from '../Config/app-config'

function displayNotification(message: string, title?: string) {
  RNPushNotification.localNotification({
    title,
    message,
    playSound: false,
    vibrate: false
  })
}

function nodeEvents() {
  return eventChannel<
    | GroupAction
    | GroupsAction
    | ContactsAction
    | DeviceLogsAction
    | NotificationsAction
    | TextileEventsAction
  >(emitter => {
    const subscriptions: EventSubscription[] = []
    subscriptions.push(
      Textile.events.addThreadUpdateReceivedListener(
        (threadId, feedItemData) => {
          if (
            feedItemData.type === FeedItemType.Text ||
            feedItemData.type === FeedItemType.Comment ||
            feedItemData.type === FeedItemType.Like ||
            feedItemData.type === FeedItemType.Files ||
            feedItemData.type === FeedItemType.Ignore ||
            feedItemData.type === FeedItemType.Join ||
            feedItemData.type === FeedItemType.Leave
          ) {
            emitter(groupActions.feed.refreshFeed.request({ id: threadId }))
          }

          // TODO: remove this if needed
          if (
            feedItemData.type === FeedItemType.Comment ||
            feedItemData.type === FeedItemType.Like ||
            feedItemData.type === FeedItemType.Files ||
            feedItemData.type === FeedItemType.Ignore ||
            feedItemData.type === FeedItemType.Join
          ) {
            emitter(GroupsActions.refreshThreadRequest(threadId))
          }

          if (
            feedItemData.type === FeedItemType.Join ||
            feedItemData.type === FeedItemType.Leave
          ) {
            // Every time the a JOIN or LEAVE block is detected, we should refresh our in-mem contact list
            // Enhancement: compare the joiner id with known ids and skip the refresh if known.
            emitter(contactsActions.getContactsRequest())
            // Temporary: to ensure that our UI udpates after a self-join or a self-leave
            emitter(GroupsActions.refreshThreadRequest(threadId))
          }

          // create a local log line for the threadUpdate event
          const message = `BlockType ${feedItemData.type} on ${threadId}`
          emitter(
            DeviceLogsActions.logNewEvent(
              new Date().getTime(),
              'onThreadUpdate',
              message,
              false
            )
          )
        }
      )
    )
    subscriptions.push(
      Textile.events.addThreadAddedListener(threadId => {
        emitter(GroupsActions.threadAddedNotification(threadId))
      })
    )
    subscriptions.push(
      Textile.events.addThreadRemovedListener(threadId => {
        emitter(GroupsActions.threadRemoved(threadId))
      })
    )
    subscriptions.push(
      Textile.events.addNotificationReceivedListener(notification => {
        emitter(
          NotificationActions.newNotificationRequest(
            toTypedNotification(notification)
          )
        )
      })
    )
    subscriptions.push(
      Textile.events.addNodeStartedListener(() => {
        emitter(TextileEventsActions.nodeStarted())
      })
    )
    subscriptions.push(
      Textile.events.addNodeStoppedListener(() => {
        emitter(TextileEventsActions.nodeStopped())
      })
    )
    subscriptions.push(
      Textile.events.addNodeOnlineListener(() => {
        emitter(TextileEventsActions.nodeOnline())
      })
    )
    subscriptions.push(
      Textile.events.addNodeFailedToStartListener(error => {
        emitter(TextileEventsActions.nodeFailedToStart(error))
      })
    )
    subscriptions.push(
      Textile.events.addNodeFailedToStopListener(error => {
        emitter(TextileEventsActions.nodeFailedToStop(error))
      })
    )
    subscriptions.push(
      Textile.events.addWillStopNodeInBackgroundAfterDelayListener(delay => {
        emitter(TextileEventsActions.stopNodeAfterDelayStarting(delay))
      })
    )
    subscriptions.push(
      Textile.events.addCanceledPendingNodeStopListener(() => {
        emitter(TextileEventsActions.stopNodeAfterDelayCancelled())
      })
    )
    subscriptions.push(
      Textile.events.addSyncUpdateListener(status => {
        const sizeComplete = Long.fromValue(status.sizeComplete).toNumber()
        const sizeTotal = Long.fromValue(status.sizeTotal).toNumber()
        const groupSizeComplete = Long.fromValue(
          status.groupsSizeComplete
        ).toNumber()
        const groupSizeTotal = Long.fromValue(status.groupsSizeTotal).toNumber()
        const total = Math.max(sizeTotal, groupSizeTotal)
        const { id, numComplete, numTotal } = status
        emitter(
          groupActions.fileSync.syncUpdate(
            id,
            numComplete,
            numTotal,
            groupSizeComplete,
            total
          )
        )
      })
    )
    subscriptions.push(
      Textile.events.addSyncCompleteListener(status => {
        emitter(groupActions.fileSync.syncComplete(status.id))
      })
    )
    subscriptions.push(
      Textile.events.addSyncFailedListener(status => {
        const { id, errorId, error } = status
        emitter(groupActions.fileSync.syncFailed(id, errorId, error))
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

function* initializeTextile() {
  try {
    const initialized = yield call(
      Textile.isInitialized,
      AppConfig.textileRepoPath
    )
    const verbose = yield select(PreferencesSelectors.verboseUi)
    if (!initialized) {
      const phrase = yield call(
        Textile.initializeCreatingNewWalletAndAccount,
        AppConfig.textileRepoPath,
        verbose,
        true
      )
      yield put(accountActions.setRecoveryPhrase(phrase))
    }
    yield call(Textile.launch, AppConfig.textileRepoPath, verbose)
  } catch (error) {
    yield put(TextileEventsActions.failedToInitializeNode(error))
  }
}

export function* refreshMessages() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<
        typeof TextileEventsActions.refreshMessagesRequest
      > = yield take(
        (action: RootAction) =>
          action.type === getType(TextileEventsActions.refreshMessagesRequest)
      )
      yield call(Textile.cafes.checkMessages)
      yield call(logNewEvent, 'refreshMessages', action.type)
    } catch (error) {
      yield call(logNewEvent, 'refreshMessages', error.message, true)
    }
  }
}

export function* ignoreFileRequest() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<
        typeof TextileEventsActions.ignoreFileRequest
      > = yield take(
        (action: RootAction) =>
          action.type === getType(TextileEventsActions.ignoreFileRequest)
      )

      yield call(Textile.ignores.add, action.payload.blockId)

      yield call(logNewEvent, 'ignoreFile', action.type)
    } catch (error) {
      yield call(logNewEvent, 'ignoreFileRequest', error.message, true)
    }
  }
}

export function* nodeOnline() {
  while (yield take(getType(TextileEventsActions.nodeOnline))) {
    yield call(logNewEvent, 'Node is:', 'online')
  }
}

export function* startNodeFinished() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<
        typeof TextileEventsActions.nodeStarted
      > = yield take(
        (action: RootAction) =>
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

export function* stopNodeAfterDelayStarting() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<
        typeof TextileEventsActions.stopNodeAfterDelayStarting
      > = yield take(
        (action: RootAction) =>
          action.type ===
          getType(TextileEventsActions.stopNodeAfterDelayStarting)
      )

      if (yield select(PreferencesSelectors.showNodeStateNotification)) {
        yield call(
          displayNotification,
          `Running the node for ${action.payload.delay} sec. in the background`
        )
      }
    } catch (error) {
      yield call(logNewEvent, 'stopNodeAfterDelayStarting', error.message, true)
    }
  }
}

export function* stopNodeAfterDelayCancelled() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<
        typeof TextileEventsActions.stopNodeAfterDelayCancelled
      > = yield take(
        (action: RootAction) =>
          action.type ===
          getType(TextileEventsActions.stopNodeAfterDelayCancelled)
      )

      // Let it keep running
      if (yield select(PreferencesSelectors.showNodeStateNotification)) {
        yield call(
          displayNotification,
          'Delayed stop of node canceled because of foreground event'
        )
      }
    } catch (error) {
      yield call(
        logNewEvent,
        'stopNodeAfterDelayCancelled',
        error.message,
        true
      )
    }
  }
}

export function* stopNodeAfterDelayComplete() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<
        typeof TextileEventsActions.nodeStopped
      > = yield take(
        (action: RootAction) =>
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

export function* newError() {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<
        typeof TextileEventsActions.newErrorMessage
      > = yield take(
        (action: RootAction) =>
          action.type === getType(TextileEventsActions.newErrorMessage)
      )
      if (yield select(PreferencesSelectors.showNodeErrorNotification)) {
        yield call(
          displayNotification,
          action.payload.type,
          action.payload.message
        )
      }
      yield call(logNewEvent, action.payload.type, action.payload.message, true)
    } catch (error) {
      yield call(logNewEvent, 'newError error', error.message, true)
    }
  }
}

export function* startSagas() {
  yield all([
    call(handleNodeEvents),
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
