import { Store } from 'redux'
import { PushNotificationIOS, Platform } from 'react-native'
import RNPushNotification from 'react-native-push-notification'

import { RootState } from '../../Redux/Types'
import * as actions from '../../features/updates/actions'
import { Notification } from '../../features/updates/models'

export interface UserInfo {
  notification: Notification
}

export interface PushNotification {
  foreground: boolean
  userInteraction: boolean
  message: string | object
  data: object
  badge: number
  alert: object
  sound: string
  userInfo?: UserInfo
  finish: (fetchResult: string) => void
}

export default class NotificationEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  onNotification(notification: PushNotification) {
    if (notification.userInteraction) {
      if (notification.userInfo && notification.userInfo.notification) {
        this.store.dispatch(
          actions.notificationSuccess(
            notification.userInfo.notification
          )
        )
      } else {
        this.store.dispatch(
          actions.notificationEngagement(notification)
        )
      }
    }
    if (notification.finish && Platform.OS === 'ios') {
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    }
  }

  setup() {
    RNPushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification: this.onNotification.bind(this),
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      requestPermissions: false
    })
  }
}
