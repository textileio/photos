import { Store } from 'redux'

import TextileNode from '../../../TextileNode'
import { RootState } from '../../Redux/Types'

import TextileNodeActions from '../../Redux/TextileNodeRedux'
import NotificationActions from '../../Redux/NotificationsRedux'
import ThreadsActions from '../../Redux/ThreadsRedux'

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
    TextileNode.eventEmitter.addListener('onThreadRemoved', () => {
      this.store.dispatch(ThreadsActions.refreshThreadsRequest())
    })
    TextileNode.eventEmitter.addListener('onNotification', (payload) => {
      this.store.dispatch(NotificationActions.newNotification(payload))
    })
  }

  tearDown () {
    TextileNode.eventEmitter.removeAllListeners()
  }
}
