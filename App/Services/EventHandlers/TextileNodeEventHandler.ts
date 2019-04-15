import { Store } from 'redux'
import Textile, { EventSubscription } from '@textile/react-native-sdk'

import { RootState } from '../../Redux/Types'

import NotificationActions from '../../Redux/NotificationsRedux'
import PhotoViewingActions from '../../Redux/PhotoViewingRedux'
import { contactsActions } from '../../features/contacts'
import DeviceLogsActions from '../../Redux/DeviceLogsRedux'
import { toTypedNotification } from '../Notifications'

import TextileEventsActions, { NodeState } from '../../Redux/TextileEventsRedux'
import { groupActions } from '../../features/group'

export default class TextileNodeEventHandler {
  store: Store<RootState>
  subscriptions: EventSubscription[] = []

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  setup() {
    this.subscriptions.push(
      Textile.events.addThreadUpdateReceivedListener((update) => {
        const { type_url } = update.payload
        if (type_url === '/Text' ||
          type_url === '/Comment' ||
          type_url === '/Like' ||
          type_url === '/Files' ||
          type_url === '/Ignore' ||
          type_url === '/Join' ||
          type_url === '/Leave') {
          this.store.dispatch(groupActions.feed.refreshFeed.request({ id: update.thread }))
        }

        // TODO: remove this if needed
        if (type_url === '/Comment' ||
          type_url === '/Like' ||
          type_url === '/Files' ||
          type_url === '/Ignore' ||
          type_url === '/Join') {
          this.store.dispatch(PhotoViewingActions.refreshThreadRequest(update.thread))
        }

        if (type_url === '/Join' ||
            type_url === '/Leave') {
          // Every time the a JOIN or LEAVE block is detected, we should refresh our in-mem contact list
          // Enhancement: compare the joiner id with known ids and skip the refresh if known.
          this.store.dispatch(contactsActions.getContactsRequest())
        }

        // create a local log line for the threadUpdate event
        const message = `BlockType ${type_url} on ${update.thread}`
        this.store.dispatch(DeviceLogsActions.logNewEvent((new Date()).getTime(), 'onThreadUpdate', message, false))
      })
    )
    this.subscriptions.push(
      Textile.events.addThreadAddedListener((threadId) => {
        this.store.dispatch(PhotoViewingActions.threadAddedNotification(threadId))
      })
    )
    this.subscriptions.push(
      Textile.events.addThreadRemovedListener((threadId) => {
        this.store.dispatch(PhotoViewingActions.threadRemoved(threadId))
      })
    )
    this.subscriptions.push(
      Textile.events.addNotificationReceivedListener((notification) => {
        this.store.dispatch(NotificationActions.newNotificationRequest(toTypedNotification(notification)))
      })
    )
    this.subscriptions.push(
      Textile.events.addNodeStartedListener(() => {
        this.store.dispatch(TextileEventsActions.nodeStarted())
      })
    )
    this.subscriptions.push(
      Textile.events.addNodeStoppedListener(() => {
        this.store.dispatch(TextileEventsActions.nodeStopped())
      })
    )
    this.subscriptions.push(
      Textile.events.addNodeOnlineListener(() => {
        this.store.dispatch(TextileEventsActions.nodeOnline())
      })
    )
    this.subscriptions.push(
      Textile.events.addNodeFailedToStartListener((error) => {
        this.store.dispatch(TextileEventsActions.nodeFailedToStart(error))
      })
    )
    this.subscriptions.push(
      Textile.events.addNodeFailedToStopListener((error) => {
        this.store.dispatch(TextileEventsActions.nodeFailedToStop(error))
      })
    )
    this.subscriptions.push(
      Textile.events.addWillStopNodeInBackgroundAfterDelayListener((delay) => {
        this.store.dispatch(TextileEventsActions.stopNodeAfterDelayStarting(delay))
      })
    )
    this.subscriptions.push(
      Textile.events.addCanceledPendingNodeStopListener(() => {
        this.store.dispatch(TextileEventsActions.stopNodeAfterDelayCancelled())
      })
    )
  }

  tearDown() {
    for (const subscription of this.subscriptions) {
      subscription.cancel()
    }
  }
}
