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
import {AppState, Share, PermissionsAndroid, Platform, PushNotificationIOS} from 'react-native'
import { call, put, select, take, fork } from 'redux-saga/effects'
import { Alert } from 'react-native'
import NavigationService from '../Services/NavigationService'
import { PreferencesSelectors, ServiceType } from '../Redux/PreferencesRedux'
import NotificationsActions  from '../Redux/NotificationsRedux'
import { ThreadsSelectors } from '../Redux/ThreadsRedux'
import UIActions from '../Redux/UIRedux'
import { ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'
import * as NotificationsServices from '../Services/Notifications'
import PreferencesActions from '../Redux/PreferencesRedux'
import {TextileNodeSelectors} from '../Redux/TextileNodeRedux'
import {delay} from 'redux-saga'
import TextileNode from '../../TextileNode'

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

  // fire the notification
  NotificationsServices.createNew(notification)
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
      const thread = yield select(ThreadsSelectors.threadByName, notification.category)
      yield call(TextileNode.readNotification, notification.id)
      yield put(UIActions.viewThreadRequest(thread.id, thread.name))
    }
  } catch (error) {
    yield put(NotificationsActions.notificationFailure(notification))
  }
}

export function * refreshNotifications () {
  try {
    const notificationResponse = yield call(TextileNode.getNotifications, -1)
    yield put(NotificationsActions.refreshNotificationsSuccess(notificationResponse.items))
  } catch (error) {
    // Nothing to do
  }
}
