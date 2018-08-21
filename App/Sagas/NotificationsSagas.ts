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
import { Platform } from 'react-native'
import { call, put, select } from 'redux-saga/effects'
import { PreferencesSelectors, ServiceType } from '../Redux/PreferencesRedux'
import NotificationsActions, { NotificationsSelectors }  from '../Redux/NotificationsRedux'
import { ThreadsSelectors } from '../Redux/ThreadsRedux'
import UIActions from '../Redux/UIRedux'
import { ActionType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'
import * as NotificationsServices from '../Services/Notifications'
import {TextileNodeSelectors} from '../Redux/TextileNodeRedux'
import TextileNode from '../../TextileNode'
import {delay} from 'redux-saga'

export function * enable () {
  yield call(NotificationsServices.enable)
}

export function * handleNewNotification (action: ActionType<typeof NotificationsActions.newNotificationRequest>) {
  const service = yield select(PreferencesSelectors.service, 'notifications')
  // if No notifications enabled, return
  if (!service || service.status !== true) return
  const { notification } = action.payload
  const type = TextileTypes.NotificationType[notification.type] as string

  // if notifications for this type are not enabled, return
  const preferences = yield select(PreferencesSelectors.service, type as ServiceType)
  if (!preferences || preferences.status !== true) return

  // Ensure we aren't in the foreground (Android only req)
  const queriedAppState = yield select(TextileNodeSelectors.appState)
  if (Platform.OS === 'ios' || queriedAppState.match(/background/)) {
    // fire the notification
    NotificationsServices.createNew(notification)
  }
}

export function * handleEngagement (action: ActionType<typeof NotificationsActions.notificationEngagement>) {
  // Deals with the Engagement response from clicking a native notification
  const { data } = action.payload.engagement
  try {
    if (!data || !data.notification || !data.notification.type) return
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
    if (notification.type in [2,3,4,5,6] && notification.target_id && notification.target_id !== '') {
      const thread = yield select(ThreadsSelectors.threadById, notification.target_id)
      yield call(TextileNode.readNotification, notification.id)
      yield put(UIActions.viewThreadRequest(thread.id, thread.name))
    } else {
      yield call(TextileNode.readNotification, notification.id)
    }
    // Helpful so that the feedview will update with latest
    // TODO: remove here and add to the Load time of Feedview...
    yield * refreshNotifications()
  } catch (error) {
    yield put(NotificationsActions.notificationFailure(notification))
  }
}

export function * refreshNotifications () {
  try {
    const busy = yield select(NotificationsSelectors.refreshing)
    // skip multi-request back to back
    if (busy) return
    yield put(NotificationsActions.refreshNotificationsStart())
    const notificationResponse = yield call(TextileNode.getNotifications, 99)
    yield put(NotificationsActions.refreshNotificationsSuccess(notificationResponse.items))
  } catch (error) {
    yield put(NotificationsActions.refreshNotificationsFailure())
  }
}
