import { Store } from 'redux'
import {
  DeviceEventEmitter
} from 'react-native'

import { ILocalPhotoResult } from '../../Models/TextileTypes'
import {  Events, Update, ThreadUpdate, BlockType, NotificationInfo } from '@textile/react-native-sdk'
import { RootState } from '../../Redux/Types'

import NotificationActions from '../../Redux/NotificationsRedux'
import PhotoViewingActions from '../../Redux/PhotoViewingRedux'
import ContactsActions from '../../Redux/ContactsRedux'
import DeviceLogsActions from '../../Redux/DeviceLogsRedux'
import StorageActions from '../../Redux/StorageRedux'
import { toTypedNotification } from '../Notifications'

import MockBridge from '../../Redux/MockBridge'
import AccountActions from '../../Redux/AccountRedux'
import MigrationActions from '../../Redux/MigrationRedux'

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
    // Events.addListener('onOnline', () => {
    //   this.store.dispatch(MockBridge.nodeOnline())
    // })
    Events.addListener('onThreadUpdate', (update: ThreadUpdate) => {
      const { type } = update.block
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
    DeviceEventEmitter.addListener('@textile/startNodeFinished', () => {
      this.store.dispatch(MockBridge.startNodeFinished())
    })
    DeviceEventEmitter.addListener('@textile/stopNodeAfterDelayStarting', () => {
      this.store.dispatch(MockBridge.stopNodeAfterDelayStarting())
    })
    DeviceEventEmitter.addListener('@textile/stopNodeAfterDelayCancelled', () => {
      this.store.dispatch(MockBridge.stopNodeAfterDelayCancelled())
    })
    DeviceEventEmitter.addListener('@textile/stopNodeAfterDelayFinishing', () => {
      this.store.dispatch(MockBridge.stopNodeAfterDelayFinishing())
    })
    DeviceEventEmitter.addListener('@textile/stopNodeAfterDelayComplete', () => {
      this.store.dispatch(MockBridge.stopNodeAfterDelayComplete())
    })
    DeviceEventEmitter.addListener('@textile/appStateChange', (payload) => {
      console.log('axh mock? state change')
      this.store.dispatch(MockBridge.appStateChange(payload.previousState, payload.newState))
    })
    DeviceEventEmitter.addListener('@textile/updateProfile', () => {
      this.store.dispatch(MockBridge.updateProfile())
    })
    DeviceEventEmitter.addListener('@textile/newErrorMessage', (payload) => {
      this.store.dispatch(MockBridge.newErrorMessage(payload.error))
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
