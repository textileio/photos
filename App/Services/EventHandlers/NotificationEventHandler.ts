import { Store } from 'redux'
import PushNotification from 'react-native-push-notification'
import {PushNotificationIOS} from 'react-native'
import { RootState } from '../../Redux/Types'
import TriggersActions from '../../Redux/TriggersRedux'
import * as TextileTypes from '../../Models/TextileTypes'

export default class NotificationEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  onNotification (notification: TextileTypes.NotificationEngagement) {
    if (notification.userInteraction === true) {
      this.store.dispatch(TriggersActions.newEngagement(notification))
    }
    if (notification.finish) {
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
