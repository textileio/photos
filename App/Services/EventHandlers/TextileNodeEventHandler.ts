import { Store } from 'redux'

import { Update, BlockType } from '../../Models/TextileTypes'
import TextileNode from '../../../TextileNode'
import { RootState } from '../../Redux/Types'

import TextileNodeActions from '../../Redux/TextileNodeRedux'
import NotificationActions from '../../Redux/NotificationsRedux'
import PhotoViewingActions from '../../Redux/PhotoViewingRedux'

export default class TextileNodeEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  setup () {
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
    })
    TextileNode.eventEmitter.addListener('onThreadRemoved', (payload) => {
    })
    TextileNode.eventEmitter.addListener('onNotification', (payload) => {
      this.store.dispatch(NotificationActions.newNotificationRequest(payload))
    })
  }

  tearDown () {
    TextileNode.eventEmitter.removeAllListeners()
  }
}
