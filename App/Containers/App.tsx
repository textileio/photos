import '../Config'
import React from 'react'
import { Component } from 'react'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import RootContainer from './RootContainer'
import configureStore from '../Redux/configureStore'
import TriggersActions from '../Redux/TriggersRedux'
import NotificationActions from '../Redux/NotificationsRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import ThreadActions from '../Redux/ThreadsRedux'
import BackgroundTask from 'react-native-background-task'
import TextileNode from '../../TextileNode'

const { store, persistor } = configureStore()

BackgroundTask.define(() => {
  store.dispatch(TriggersActions.backgroundTask())
})

// subscribe to native events
// NOTE: we may want to cancel listener with the returned handle at some point with subscription.remove()
TextileNode.eventEmitter.addListener('onOnline', () => {
  store.dispatch(TextileNodeActions.nodeOnline())
  store.dispatch(NotificationActions.newNotification({
    category: 'node',
    type: 'onOnline',
    read: false,
    unique: true,
    timestamp: Date.now()
  }))
})
// TODO: add types to event emitter if possible
TextileNode.eventEmitter.addListener('onThreadUpdate', (payload) => {
  store.dispatch(TextileNodeActions.getPhotoHashesRequest(payload.thread_id))
  store.dispatch(NotificationActions.newNotification({
    category: 'content',
    type: 'onThreadUpdate',
    read: false,
    timestamp: Date.now(),
    payload
  }))
})
TextileNode.eventEmitter.addListener('onThreadAdded', (payload) => {
  store.dispatch(ThreadActions.refreshThreadsRequest())
  store.dispatch(NotificationActions.newNotification({
    category: 'threads',
    type: 'onThreadAdded',
    read: false,
    timestamp: Date.now(),
    payload
  }))
})
TextileNode.eventEmitter.addListener('onThreadRemoved', (payload) => {
  store.dispatch(ThreadActions.refreshThreadsRequest())
  store.dispatch(NotificationActions.newNotification({
    category: 'threads',
    type: 'onThreadRemoved',
    read: false,
    timestamp: Date.now(),
    payload
  }))
})
TextileNode.eventEmitter.addListener('onDeviceAdded', () => {
  store.dispatch(NotificationActions.newNotification({
    category: 'devices',
    type: 'onDeviceAdded',
    read: false,
    timestamp: Date.now()
  }))
})
TextileNode.eventEmitter.addListener('onDeviceRemoved', () => {
  store.dispatch(NotificationActions.newNotification({
    category: 'devices',
    type: 'onDeviceRemoved',
    read: false,
    timestamp: Date.now()
  }))
})
class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootContainer />
        </PersistGate>
      </Provider>
    )
  }
}

export default App
