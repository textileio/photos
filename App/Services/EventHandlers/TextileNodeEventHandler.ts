import { Store } from 'redux'

import { ILocalPhotoResult } from '../../Models/TextileTypes'
import {  Update, ThreadUpdate, BlockType, NotificationInfo } from '../../NativeModules/Textile'
import EventEmitter from '../../NativeModules/Events'
import { RootState } from '../../Redux/Types'

import TextileNodeActions from '../../Redux/TextileNodeRedux'
import NotificationActions from '../../Redux/NotificationsRedux'
import PhotoViewingActions from '../../Redux/PhotoViewingRedux'
import DeviceLogsActions from '../../Redux/DeviceLogsRedux'
import StorageActions from '../../Redux/StorageRedux'
import { toTypedNotification } from '../Notifications'

export default class TextileNodeEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  setup () {
    EventEmitter.addListener('newLocalPhoto', (localPhoto: ILocalPhotoResult) => {
      this.store.dispatch(StorageActions.newLocalPhoto(localPhoto))
    })
    EventEmitter.addListener('onOnline', () => {
      this.store.dispatch(TextileNodeActions.nodeOnline())
    })
    EventEmitter.addListener('onThreadUpdate', (update: ThreadUpdate) => {
      const { type } = update.block
      if (type === BlockType.COMMENT ||
        type === BlockType.LIKE ||
        type === BlockType.FILES ||
        type === BlockType.IGNORE) {
        this.store.dispatch(PhotoViewingActions.refreshThreadRequest(update.thread_id))
      } else if (type === BlockType.JOIN) {

      }
      // create a local log line for the threadUpdate event
      const name = update.thread_name || update.thread_id
      const message = `BlockType ${type} on ${name}`
      this.store.dispatch(DeviceLogsActions.logNewEvent( (new Date()).getTime(), 'onThreadUpdate', message, false))
    })
    EventEmitter.addListener('onThreadAdded', (payload: Update) => {
      this.store.dispatch(PhotoViewingActions.threadAddedNotification(payload.id))
    })
    EventEmitter.addListener('onThreadRemoved', (payload: Update) => {
      this.store.dispatch(PhotoViewingActions.threadRemoved(payload.id))
    })
    EventEmitter.addListener('onNotification', (payload: NotificationInfo) => {
      this.store.dispatch(NotificationActions.newNotificationRequest(toTypedNotification(payload)))
    })
  }

  tearDown () {
    EventEmitter.removeAllListeners()
  }
}
