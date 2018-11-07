import { Store } from 'redux'

import { ILocalPhotoResult } from '../../Models/TextileTypes'
import {  Update, ThreadUpdate, BlockType, Notification } from '../../NativeModules/Textile'
import EventEmitter from '../../NativeModules/Events'
import { RootState } from '../../Redux/Types'

import TextileNodeActions from '../../Redux/TextileNodeRedux'
import NotificationActions from '../../Redux/NotificationsRedux'
import PhotoViewingActions from '../../Redux/PhotoViewingRedux'
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
      if (type === BlockType.CommentBlock ||
        type === BlockType.LikeBlock ||
        type === BlockType.PhotoBlock ||
        type === BlockType.IgnoreBlock) {
        this.store.dispatch(PhotoViewingActions.refreshThreadRequest(update.thread_id))
      }
    })
    EventEmitter.addListener('onThreadAdded', (payload: Update) => {
      this.store.dispatch(PhotoViewingActions.threadAdded(payload.id, payload.name))
    })
    EventEmitter.addListener('onThreadRemoved', (payload: Update) => {
      this.store.dispatch(PhotoViewingActions.threadRemoved(payload.id))
    })
    EventEmitter.addListener('onNotification', (payload: Notification) => {
      this.store.dispatch(NotificationActions.newNotificationRequest(toTypedNotification(payload)))
    })
  }

  tearDown () {
    EventEmitter.removeAllListeners()
  }
}
