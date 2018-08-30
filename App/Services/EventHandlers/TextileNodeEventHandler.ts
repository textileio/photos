import { Store } from 'redux'

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
    TextileNode.eventEmitter.addListener('onThreadUpdate', (payload) => {
      this.store.dispatch(PhotoViewingActions.refreshThreadRequest(payload.thread_id))
    })
    TextileNode.eventEmitter.addListener('onThreadAdded', () => {
      this.store.dispatch(PhotoViewingActions.refreshThreadsRequest())
    })
    TextileNode.eventEmitter.addListener('onThreadRemoved', () => {
      this.store.dispatch(PhotoViewingActions.refreshThreadsRequest())
    })
    TextileNode.eventEmitter.addListener('onNotification', (payload) => {
      this.store.dispatch(NotificationActions.newNotificationRequest(payload))
    })
  }

  tearDown () {
    TextileNode.eventEmitter.removeAllListeners()
  }
}
