import { Store } from 'redux'
import { PushNotificationIOS, Platform } from 'react-native'
import PushNotification from 'react-native-push-notification'

import { RootState } from '../../Redux/Types'
import NotificationsActions from '../../Redux/NotificationsRedux'
import { NotificationEngagement } from '../../Models/TextileTypes'

export default class NotificationEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  onNotification (notification: NotificationEngagement) {
    if (notification.userInteraction === true) {
      this.store.dispatch(NotificationsActions.notificationEngagement(notification))
    }
    if (notification.finish && Platform.OS === 'ios') {
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    }
  }

  setup () {
    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification: this.onNotification.bind(this),
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      requestPermissions: false,
    })
  }

  tearDown () {
  }
}
