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
import NavigationService from '../Services/NavigationService'
import PreferencesActions, { PreferencesSelectors, ServiceType } from '../Redux/PreferencesRedux'
import NotificationsActions, { NotificationsSelectors } from '../Redux/NotificationsRedux'
import { ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'
import * as NotificationsServices from '../Services/Notifications'

export function * enable () {
  yield call(NotificationsServices.enable)
}

export function * handleNewNotification (action: ActionType<typeof NotificationsActions.newNotificationRequest>) {
  const service = yield select(PreferencesSelectors.service, 'notifications')
  // TODO: handle within-app notifications

  // if No notifications enabled, return
  if (!service || service.status !== true) return
  const { notification } = action.payload
  const type = TextileTypes.NotificationType[notification.type] as string

  // if notifications for this type are not enabled, return
  const preferences = yield select(PreferencesSelectors.service, type as ServiceType)
  if (!preferences || preferences.status !== true) return

  // fire the notification
  NotificationsServices.newLocalNotification(notification)
}
