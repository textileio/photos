import { Store } from 'redux'
import {
  DeviceEventEmitter
} from 'react-native'

import { ILocalPhotoResult } from '../../Models/TextileTypes'
import Textile, { Events, Update, ThreadUpdate, BlockType, NotificationInfo } from '@textile/react-native-sdk'
import { RootState } from '../../Redux/Types'

import NotificationActions from '../../Redux/NotificationsRedux'
import PhotoViewingActions from '../../Redux/PhotoViewingRedux'
import ContactsActions from '../../Redux/ContactsRedux'
import DeviceLogsActions from '../../Redux/DeviceLogsRedux'
import StorageActions from '../../Redux/StorageRedux'
import { toTypedNotification } from '../Notifications'

import TextileEventsActions from '../../Redux/TextileEventsRedux'
import AccountActions from '../../Redux/AccountRedux'
import MigrationActions from '../../Redux/MigrationRedux'
import { groupActions } from '../../features/group'

export default class TextileNodeEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  setup () {
    Events.addListener('newLocalPhoto', (localPhoto: ILocalPhotoResult) => {
      this.store.dispatch(StorageActions.newLocalPhoto(localPhoto))
    })
    // Now handled internally by sdk
    Events.addListener('onOnline', () => {
      this.store.dispatch(TextileEventsActions.nodeOnline())
    })
    Events.addListener('onThreadUpdate', (update: ThreadUpdate) => {
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
        type === BlockType.IGNORE) {
        this.store.dispatch(PhotoViewingActions.refreshThreadRequest(update.thread_id))
      } else if (type === BlockType.JOIN) {
        // Every time the a JOIN block is detected, we should refresh our in-mem contact list
        // Enhancement: compare the joiner id with known ids and skip the refresh if known.
        this.store.dispatch(ContactsActions.getContactsRequest())
      }

      // create a local log line for the threadUpdate event
      const name = update.thread_name || update.thread_id
      const message = `BlockType ${type} on ${name}`
      this.store.dispatch(DeviceLogsActions.logNewEvent( (new Date()).getTime(), 'onThreadUpdate', message, false))
    })
    Events.addListener('onThreadAdded', (payload: Update) => {
      this.store.dispatch(PhotoViewingActions.threadAddedNotification(payload.id))
    })
    Events.addListener('onThreadRemoved', (payload: Update) => {
      this.store.dispatch(PhotoViewingActions.threadRemoved(payload.id))
    })
    Events.addListener('onNotification', (payload: NotificationInfo) => {
      this.store.dispatch(NotificationActions.newNotificationRequest(toTypedNotification(payload)))
    })

    /* ----- JS Events from SDK -----*/

    // New Bridge actions

    DeviceEventEmitter.addListener('@textile/newNodeState', (payload) => {
      this.store.dispatch(TextileEventsActions.newNodeState(payload.state))
    })
    DeviceEventEmitter.addListener('@textile/startNodeFinished', () => {
      this.store.dispatch(TextileEventsActions.startNodeFinished())
    })
    DeviceEventEmitter.addListener('@textile/stopNodeAfterDelayStarting', () => {
      this.store.dispatch(TextileEventsActions.stopNodeAfterDelayStarting())
    })
    DeviceEventEmitter.addListener('@textile/stopNodeAfterDelayCancelled', () => {
      this.store.dispatch(TextileEventsActions.stopNodeAfterDelayCancelled())
    })
    DeviceEventEmitter.addListener('@textile/stopNodeAfterDelayFinishing', () => {
      this.store.dispatch(TextileEventsActions.stopNodeAfterDelayFinishing())
    })
    DeviceEventEmitter.addListener('@textile/stopNodeAfterDelayComplete', () => {
      this.store.dispatch(TextileEventsActions.stopNodeAfterDelayComplete())
    })
    DeviceEventEmitter.addListener('@textile/appStateChange', (payload) => {
      this.store.dispatch(TextileEventsActions.appStateChange(payload.previousState, payload.newState))
    })
    DeviceEventEmitter.addListener('@textile/updateProfile', () => {
      this.store.dispatch(TextileEventsActions.updateProfile())
    })
    DeviceEventEmitter.addListener('@textile/error', (payload) => {
      this.store.dispatch(TextileEventsActions.newErrorMessage(payload.type, payload.message))
    })
    // Account actions
    DeviceEventEmitter.addListener('@textile/setRecoveryPhrase', (payload) => {
      this.store.dispatch(AccountActions.setRecoveryPhrase(payload.recoveryPhrase))
    })
    DeviceEventEmitter.addListener('@textile/walletInitSuccess', () => {
      this.store.dispatch(AccountActions.initSuccess())
    })
    // Migration actions
    DeviceEventEmitter.addListener('@textile/migrationNeeded', (payload) => {
      this.store.dispatch(MigrationActions.migrationNeeded())
    })
  }

  tearDown () {
    Events.removeAllListeners()
    DeviceEventEmitter.removeAllListeners()
  }
}
