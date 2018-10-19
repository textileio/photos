import { Store } from 'redux'

import {Update, BlockType, ILocalPhotoResult} from '../../Models/TextileTypes'
import TextileNode from '../TextileNode'
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
    TextileNode.eventEmitter.addListener('newLocalPhoto', (localPhoto: ILocalPhotoResult) => {
      this.store.dispatch(StorageActions.newLocalPhoto(localPhoto))
    })
    TextileNode.eventEmitter.addListener('onOnline', () => {
      this.store.dispatch(TextileNodeActions.nodeOnline())
    })
    TextileNode.eventEmitter.addListener('onThreadUpdate', (update: Update) => {
      const { type } = update.block
      if (type === BlockType.CommentBlock ||
        type === BlockType.LikeBlock ||
        type === BlockType.PhotoBlock ||
        type === BlockType.IgnoreBlock) {
        this.store.dispatch(PhotoViewingActions.refreshThreadRequest(update.thread_id))
      }
    })
    TextileNode.eventEmitter.addListener('onThreadAdded', (payload) => {
      this.store.dispatch(PhotoViewingActions.threadAdded(payload.id, payload.name))
    })
    TextileNode.eventEmitter.addListener('onThreadRemoved', (payload) => {
      this.store.dispatch(PhotoViewingActions.threadRemoved(payload.id))
    })
    TextileNode.eventEmitter.addListener('onNotification', (payload) => {
      this.store.dispatch(NotificationActions.newNotificationRequest(toTypedNotification(payload)))
    })
  }

  tearDown () {
    TextileNode.eventEmitter.removeAllListeners()
  }
}
