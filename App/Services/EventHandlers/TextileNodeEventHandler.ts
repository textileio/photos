import { Store } from 'redux'
import { pb, Events } from '@textile/react-native-sdk'
import { Buffer } from 'buffer'

import { RootState } from '../../Redux/Types'

import NotificationActions from '../../Redux/NotificationsRedux'
import PhotoViewingActions from '../../Redux/PhotoViewingRedux'
import { contactsActions } from '../../features/contacts'
import DeviceLogsActions from '../../Redux/DeviceLogsRedux'
import { toTypedNotification } from '../Notifications'

import TextileEventsActions from '../../Redux/TextileEventsRedux'
import AccountActions from '../../Redux/AccountRedux'
import { groupActions } from '../../features/group'

export default class TextileNodeEventHandler {
  store: Store<RootState>
  events = new Events()

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  setup () {
    // Now handled internally by sdk
    this.events.addListener('NODE_ONLINE', () => {
      this.store.dispatch(TextileEventsActions.nodeOnline())
    })
    this.events.addListener('THREAD_UPDATE', (base64: string) => {
      const update = pb.FeedItem.decode(Buffer.from(base64, 'base64'))
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

      if (type_url === '/Join') {
        // Every time the a JOIN block is detected, we should refresh our in-mem contact list
        // Enhancement: compare the joiner id with known ids and skip the refresh if known.
        this.store.dispatch(contactsActions.getContactsRequest())
      }

      // create a local log line for the threadUpdate event
      const message = `BlockType ${type_url} on ${update.thread}`
      this.store.dispatch(DeviceLogsActions.logNewEvent( (new Date()).getTime(), 'onThreadUpdate', message, false))
    })
    this.events.addListener('WALLET_UPDATE', (base64: string) => {
      const update: pb.IWalletUpdate = pb.WalletUpdate.decode(Buffer.from(base64, 'base64'))
      switch (update.type) {
        case pb.WalletUpdate.Type.THREAD_ADDED:
          this.store.dispatch(PhotoViewingActions.threadAddedNotification(update.id))
          break
        case pb.WalletUpdate.Type.THREAD_REMOVED:
          this.store.dispatch(PhotoViewingActions.threadRemoved(update.id))
        default:
          break
      }
    })
    this.events.addListener('NOTIFICATION', (base64: string) => {
      const payload = pb.Notification.decode(Buffer.from(base64, 'base64'))
      this.store.dispatch(NotificationActions.newNotificationRequest(toTypedNotification(payload)))
    })

    // TextileEventsActions
    this.events.addListener('newNodeState', (payload) => {
      this.store.dispatch(TextileEventsActions.newNodeState(payload.state))
    })
    this.events.addListener('startNodeFinished', () => {
      this.store.dispatch(TextileEventsActions.startNodeFinished())
    })
    this.events.addListener('stopNodeAfterDelayStarting', () => {
      this.store.dispatch(TextileEventsActions.stopNodeAfterDelayStarting())
    })
    this.events.addListener('stopNodeAfterDelayCancelled', () => {
      this.store.dispatch(TextileEventsActions.stopNodeAfterDelayCancelled())
    })
    this.events.addListener('stopNodeAfterDelayFinishing', () => {
      this.store.dispatch(TextileEventsActions.stopNodeAfterDelayFinishing())
    })
    this.events.addListener('stopNodeAfterDelayComplete', () => {
      this.store.dispatch(TextileEventsActions.stopNodeAfterDelayComplete())
    })
    this.events.addListener('appStateChange', (payload) => {
      this.store.dispatch(TextileEventsActions.appStateChange(payload.previousState, payload.newState))
    })
    this.events.addListener('updateProfile', () => {
      this.store.dispatch(TextileEventsActions.updateProfile())
    })
    this.events.addListener('error', (payload) => {
      this.store.dispatch(TextileEventsActions.newErrorMessage(payload.type, payload.message))
    })
    // Account actions
    this.events.addListener('setRecoveryPhrase', (payload) => {
      this.store.dispatch(AccountActions.setRecoveryPhrase(payload.recoveryPhrase))
    })
    this.events.addListener('walletInitSuccess', () => {
      this.store.dispatch(AccountActions.initSuccess())
    })
  }

  tearDown () {
    this.events.removeAllListeners()
  }
}
