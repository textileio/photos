/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/
import {Platform} from 'react-native'
import {delay} from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'

import TextileNode from '../Services/TextileNode'
import {
  NotificationType,
  GetNotificationsResult
} from '../Models/TextileTypes'
import NavigationService from '../Services/NavigationService'

import {TextileNodeSelectors} from '../Redux/TextileNodeRedux'
import ThreadsActions from '../Redux/ThreadsRedux'
import PhotoViewingAction, { ThreadData } from '../Redux/PhotoViewingRedux'
import { threadDataByThreadId } from '../Redux/PhotoViewingSelectors'
import { PreferencesSelectors, ServiceType } from '../Redux/PreferencesRedux'
import NotificationsActions, { NotificationsSelectors } from '../Redux/NotificationsRedux'
import * as NotificationsServices from '../Services/Notifications'
import {logNewEvent} from './DeviceLogs'

export function * enable () {
  yield call(NotificationsServices.enable)
}

export function * readAllNotifications (action: ActionType<typeof NotificationsActions.readAllNotificationsRequest>) {
  yield call(TextileNode.readAllNotifications)
}

export function * handleNewNotification (action: ActionType<typeof NotificationsActions.newNotificationRequest>) {
  yield call(logNewEvent, 'Notifications', 'new request')
  try {
    const service = yield select(PreferencesSelectors.service, 'notifications')
    // if No notifications enabled, return
    if (!service || service.status !== true) {
      return
    }
    const {notification} = action.payload
    const type = NotificationType[notification.type] as string

    // if notifications for this type are not enabled, return
    const preferences = yield select(PreferencesSelectors.service, type as ServiceType)
    if (!preferences || preferences.status !== true) {
      return
    }

    // Ensure we aren't in the foreground (Android only req)
    const queriedAppState = yield select(TextileNodeSelectors.appState)
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

export function * handleEngagement (action: ActionType<typeof NotificationsActions.notificationEngagement>) {
  // Deals with the Engagement response from clicking a native notification
  const data: any = action.payload.engagement.data
  try {
    if (!data || !data.hasOwnProperty('notification')) { return }
    yield call(delay, 350)
    yield put(NotificationsActions.notificationSuccess(data.notification))
  } catch (error) {
    // Nothing to do
  }
}

export function * notificationView (action: ActionType<typeof NotificationsActions.notificationSuccess>) {
  // Handles a view request for in App notification clicking or Engagement notification clicking
  // Avoids duplicating the below logic about where to send people for each notification type
  const { notification } = action.payload
  try {
    yield call(TextileNode.readNotification, notification.id)
    switch (notification.type) {
      case NotificationType.commentAddedNotification: {
        const threadData: ThreadData | undefined = yield select(threadDataByThreadId, notification.threadId)
        if (threadData) {
          yield put(PhotoViewingAction.viewThread(threadData.id))
          yield put(PhotoViewingAction.viewPhoto(notification.photoId))
          yield call(NavigationService.navigate, 'Comments')
        }
        break
      }
      case NotificationType.deviceAddedNotification:
        break
      case NotificationType.likeAddedNotification:
      case NotificationType.photoAddedNotification: {
        const threadData: ThreadData | undefined = yield select(threadDataByThreadId, notification.threadId)
        if (threadData) {
          yield put(PhotoViewingAction.viewThread(threadData.id))
          yield put(PhotoViewingAction.viewPhoto(notification.photoId))
          yield call(NavigationService.navigate, 'PhotoScreen')
        }
        break
      }
      case NotificationType.peerJoinedNotification:
      case NotificationType.peerLeftNotification: {
        const threadData: ThreadData | undefined = yield select(threadDataByThreadId, notification.threadId)
        if (threadData) {
          yield put(PhotoViewingAction.viewThread(threadData.id))
          yield call(NavigationService.navigate, 'ViewThread', { id: threadData.id, name: threadData.name })
        }
        break
      }
      case NotificationType.receivedInviteNotification: {
        yield * waitUntilOnline(1000)
        yield put(NotificationsActions.reviewNotificationThreadInvite(notification))
        break
      }
    }
  } catch (error) {
    yield put(NotificationsActions.notificationFailure(notification))
  }
}

export function * refreshNotifications () {
  try {
    const busy = yield select(NotificationsSelectors.refreshing)
    // skip multi-request back to back
    if (busy) { return }
    yield * waitUntilOnline(1000)
    yield put(NotificationsActions.refreshNotificationsStart())
    const notificationResponse: GetNotificationsResult = yield call(TextileNode.getNotifications, 99)
    yield put(NotificationsActions.refreshNotificationsSuccess(notificationResponse.items.map((notificationData) => NotificationsServices.toTypedNotification(notificationData))))
  } catch (error) {
    yield put(NotificationsActions.refreshNotificationsFailure())
  }
}

export function * reviewThreadInvite (action: ActionType<typeof NotificationsActions.reviewNotificationThreadInvite>) {
  const { notification } = action.payload
  try {
    const payload = NotificationsServices.toPayload(notification)
    if (!payload) { return }
    yield call(NotificationsServices.displayInviteAlert, payload.message)
    yield put(ThreadsActions.acceptInviteRequest(notification.id, notification.threadName))
  } catch (error) {
    // Ignore invite
  }
}

export function * waitUntilOnline(ms: number) {
  let ttw = ms
  let online = yield select(TextileNodeSelectors.online)
  while (!online && 0 < ttw) {
    yield delay(50)
    online = yield select(TextileNodeSelectors.online)
    ttw -= 50
  }
  return online
}
