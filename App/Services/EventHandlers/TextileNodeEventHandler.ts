import { Store } from 'redux'

import { ILocalPhotoResult } from '../../Models/TextileTypes'
import { Events, Update, ThreadUpdate, BlockType, NotificationInfo } from '@textile/react-native-sdk'
import { RootState } from '../../Redux/Types'

import NotificationActions from '../../Redux/NotificationsRedux'
import PhotoViewingActions from '../../Redux/PhotoViewingRedux'
import ContactsActions from '../../Redux/ContactsRedux'
import DeviceLogsActions from '../../Redux/DeviceLogsRedux'
import StorageActions from '../../Redux/StorageRedux'
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
    this.events.addListener('newLocalPhoto', (localPhoto: ILocalPhotoResult) => {
      this.store.dispatch(StorageActions.newLocalPhoto(localPhoto))
    })
    this.events.addListener('newLocalPhoto', (localPhoto: ILocalPhotoResult) => {
      this.store.dispatch(StorageActions.newLocalPhoto(localPhoto))
    })
    // Now handled internally by sdk
    this.events.addListener('onOnline', () => {
      this.store.dispatch(TextileEventsActions.nodeOnline())
    })
    this.events.addListener('onThreadUpdate', (update: ThreadUpdate) => {
      const { type } = update.block
      if (type === BlockType.MESSAGE ||
        type === BlockType.COMMENT ||
        type === BlockType.LIKE ||
        type === BlockType.FILES ||
        type === BlockType.IGNORE ||
        type === BlockType.JOIN ||
        type === BlockType.LEAVE) {
        this.store.dispatch(groupActions.feed.refreshFeed.request({ id: update.thread_id }))
      }

      // TODO: remove this if needed
      if (type === BlockType.COMMENT ||
        type === BlockType.LIKE ||
        type === BlockType.FILES ||
        type === BlockType.IGNORE ||
        type === BlockType.JOIN) {
        this.store.dispatch(PhotoViewingActions.refreshThreadRequest(update.thread_id))
      }

      if (type === BlockType.JOIN) {
        // Every time the a JOIN block is detected, we should refresh our in-mem contact list
        // Enhancement: compare the joiner id with known ids and skip the refresh if known.
        this.store.dispatch(ContactsActions.getContactsRequest())
      }

      // create a local log line for the threadUpdate event
      const name = update.thread_name || update.thread_id
      const message = `BlockType ${type} on ${name}`
      this.store.dispatch(DeviceLogsActions.logNewEvent( (new Date()).getTime(), 'onThreadUpdate', message, false))
    })
    this.events.addListener('onThreadAdded', (payload: Update) => {
      this.store.dispatch(PhotoViewingActions.threadAdded(payload.id, payload.key, payload.name))
      this.store.dispatch(PhotoViewingActions.threadAddedNotification(payload.id))
    })
    this.events.addListener('onThreadRemoved', (payload: Update) => {
      this.store.dispatch(PhotoViewingActions.threadRemoved(payload.id))
    })
    this.events.addListener('onNotification', (payload: NotificationInfo) => {
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
