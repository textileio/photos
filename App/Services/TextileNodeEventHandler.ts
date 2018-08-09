import { Store } from 'redux'

import TextileNode from '../../TextileNode'
import { RootState } from '../Redux/Types'

import TextileNodeActions from '../Redux/TextileNodeRedux'
import NotificationActions from '../Redux/NotificationsRedux'
import ThreadsActions from '../Redux/ThreadsRedux'

export default class TextileNodeEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  setup () {
    TextileNode.eventEmitter.addListener('onOnline', () => {
      this.store.dispatch(TextileNodeActions.nodeOnline())
      this.dispatchNotification('node', 'onOnline', undefined, true)
    })
    TextileNode.eventEmitter.addListener('onThreadUpdate', (payload) => {
      this.store.dispatch(TextileNodeActions.getPhotoHashesRequest(payload.thread_id))
      this.dispatchNotification('content', 'onThreadUpdate', payload)
    })
    TextileNode.eventEmitter.addListener('onThreadAdded', (payload) => {
      this.store.dispatch(ThreadsActions.refreshThreadsRequest())
      this.dispatchNotification('threads', 'onThreadAdded', payload)
    })
    TextileNode.eventEmitter.addListener('onThreadRemoved', (payload) => {
      this.store.dispatch(ThreadsActions.refreshThreadsRequest())
      this.dispatchNotification('threads', 'onThreadRemoved', payload)
    })
    TextileNode.eventEmitter.addListener('onDeviceAdded', () => {
      this.dispatchNotification('devices', 'onDeviceAdded')
    })
    TextileNode.eventEmitter.addListener('onDeviceRemoved', () => {
      this.dispatchNotification('devices', 'onDeviceRemoved')
    })
  }

  tearDown () {
    TextileNode.eventEmitter.removeAllListeners()
  }

  dispatchNotification (category: 'node' | 'devices' | 'threads' | 'content', type: string, payload?: any, unique?: boolean) {
    this.store.dispatch(NotificationActions.newNotification({
      category,
      type,
      read: false,
      unique,
      payload,
      timestamp: Date.now()
    }))
  }
}