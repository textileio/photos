import { Platform, AppState } from 'react-native'
import { delay } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'

import Textile, {
  Notification,
  INotificationList
} from '@textile/react-native-sdk'
import NavigationService from '../Services/NavigationService'

import { groupActions } from '../features/group'
import ThreadsActions from '../Redux/ThreadsRedux'
import GroupsActions, { ThreadData } from '../Redux/GroupsRedux'
import { threadDataByThreadId, allThreadIds } from '../Redux/GroupsSelectors'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import { PreferencesSelectors, ServiceType } from '../Redux/PreferencesRedux'
import NotificationsActions, {
  NotificationsSelectors
} from '../Redux/NotificationsRedux'
import TextileEventsActions, {
  TextileEventsSelectors
} from '../Redux/TextileEventsRedux'
import * as NotificationsServices from '../Services/Notifications'
import { logNewEvent } from './DeviceLogs'

export function* waitUntilOnline(ms: number) {
  let ttw = ms
  let online = yield select(TextileEventsSelectors.online)
  while (!online && ttw > 0) {
    yield delay(50)
    online = yield select(TextileEventsSelectors.online)
    ttw -= 50
  }
  return online
}

export function* enable() {
  yield call(NotificationsServices.enable)
}

export function* readAllNotifications(
  action: ActionType<typeof NotificationsActions.readAllNotificationsRequest>
) {
  try {
    yield call(Textile.notifications.readAll)
  } catch (error) {
    yield put(
      TextileEventsActions.newErrorMessage(
        'readAllNotifications',
        error.message
      )
    )
  }
}

export function* handleNewNotification(
  action: ActionType<typeof NotificationsActions.newNotificationRequest>
) {
  yield call(logNewEvent, 'Notifications', 'new request')
  try {
    const service = yield select(PreferencesSelectors.service, 'notifications')
    // if No notifications enabled, return
    if (!service || service.status !== true) {
      return
    }
    const { notification } = action.payload
    const type = notification.type

    // if notifications for this type are not enabled, return
    const typeString = NotificationsServices.notificationTypeToString(type)
    const preferences = yield select(
      PreferencesSelectors.service,
      typeString as ServiceType
    )
    if (!preferences || preferences.status !== true) {
      return
    }

    // Ensure we aren't in the foreground (Android only req)
    // const queriedAppState = yield select(TextileNodeSelectors.appState)
    const queriedAppState = AppState.currentState
    if (Platform.OS === 'ios' || queriedAppState.match(/background/)) {
      // fire the notification
      yield call(logNewEvent, 'Notifications', 'creating local')
      yield call(NotificationsServices.createNew, notification)
    } else {
      yield call(logNewEvent, 'Notifications', 'creating local')
    }
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message
    yield call(logNewEvent, 'Notifications', message, true)
  }
}

export function* handleEngagement(
  action: ActionType<typeof NotificationsActions.notificationEngagement>
) {
  // Deals with the Engagement response from clicking a native notification
  const data: any = action.payload.engagement.data
  try {
    if (!data || !data.hasOwnProperty('notification')) {
      return
    }
    yield call(delay, 350)
    yield put(NotificationsActions.notificationSuccess(data.notification))
  } catch (error) {
    // Nothing to do
  }
}

function* requestAndNavigateTo(threadId: string, photoBlock?: string) {
  // Cache our thread data in redux
  yield put(groupActions.feed.loadFeedItems.request({ id: threadId }))
  // Select the thread
  yield put(PhotoViewingActions.viewThread(threadId))

  if (photoBlock) {
    // if photo supplied, select and navigate to it
    yield put(PhotoViewingActions.viewPhoto(photoBlock))
    yield call(NavigationService.navigate, 'PhotoScreen')
  } else {
    // if no photo, navigate to the thread only
    yield call(NavigationService.navigate, 'ViewThread', { threadId })
  }
}

export function* notificationView(
  action: ActionType<typeof NotificationsActions.notificationSuccess>
) {
  // Handles a view request for in App notification clicking or Engagement notification clicking
  // Avoids duplicating the below logic about where to send people for each notification type
  const { notification } = action.payload
  try {
    yield call(Textile.notifications.read, notification.id)
    switch (notification.type) {
      case Notification.Type.LIKE_ADDED:
      case Notification.Type.COMMENT_ADDED: {
        const threadData: ThreadData | undefined = yield select(
          threadDataByThreadId,
          notification.threadId
        )
        if (threadData) {
          // notification.target of a COMMENT_ADDED / LIKE_ADDED is the photo block, so where we want to navigate
          yield call(requestAndNavigateTo, threadData.id, notification.target)
        }
        break
      }
      case Notification.Type.FILES_ADDED: {
        const threadData: ThreadData | undefined = yield select(
          threadDataByThreadId,
          notification.threadId
        )
        if (threadData) {
          // notification.block of a FILES_ADDED is the photo block, so where we want to navigate
          yield call(requestAndNavigateTo, threadData.id, notification.block)
        }
        break
      }
      case Notification.Type.MESSAGE_ADDED:
      case Notification.Type.PEER_JOINED:
      case Notification.Type.PEER_LEFT: {
        const threadData: ThreadData | undefined = yield select(
          threadDataByThreadId,
          notification.threadId
        )
        if (threadData) {
          yield call(requestAndNavigateTo, threadData.id)
        }
        break
      }
      case Notification.Type.INVITE_RECEIVED: {
        yield* waitUntilOnline(1000)
        yield put(
          NotificationsActions.reviewNotificationThreadInvite(notification)
        )
        break
      }
    }
  } catch (error) {
    yield put(NotificationsActions.notificationFailure(notification))
  }
}

export function* refreshNotifications() {
  try {
    const busy = yield select(NotificationsSelectors.refreshing)
    // skip multi-request back to back
    if (busy) {
      return
    }
    yield* waitUntilOnline(1000)
    yield put(NotificationsActions.refreshNotificationsStart())
    const notificationResponse: INotificationList = yield call(
      Textile.notifications.list,
      '',
      50
    ) // TODO: offset?
    const appThreadIds = yield select(allThreadIds)
    const typedNotifs = notificationResponse.items
      .map(notificationData =>
        NotificationsServices.toTypedNotification(notificationData)
      )
      .filter(notification => {
        // converts the notification to Any since not all notifications have a threadId
        const { threadId } = notification as any
        if (threadId === undefined) {
          // These are device adds or new thread invites (not easy to know which app yet)
          return true
        } else {
          return appThreadIds.indexOf(threadId) > -1
        }
      })
    yield put(NotificationsActions.refreshNotificationsSuccess(typedNotifs))
  } catch (error) {
    yield put(
      TextileEventsActions.newErrorMessage(
        'refreshNotifications',
        error.message
      )
    )
    yield put(NotificationsActions.refreshNotificationsFailure())
  }
}

export function* reviewThreadInvite(
  action: ActionType<typeof NotificationsActions.reviewNotificationThreadInvite>
) {
  const { notification } = action.payload
  try {
    const payload = NotificationsServices.toPayload(notification)
    if (!payload) {
      return
    }
    yield call(NotificationsServices.displayInviteAlert, payload.message)
    yield put(
      ThreadsActions.acceptInviteRequest(
        notification.id,
        notification.threadName,
        false
      )
    )
  } catch (error) {
    // Ignore invite
  }
}
