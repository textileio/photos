import '../Config'
import React from 'react'
import { Component } from 'react'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import RootContainer from './RootContainer'
import configureStore from '../Redux/configureStore'
import TriggersActions from '../Redux/TriggersRedux'
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
})
// TODO: add types to event emitter if possible
TextileNode.eventEmitter.addListener('onThreadUpdate', (payload) => {
  store.dispatch(TextileNodeActions.getPhotoHashesRequest(payload.thread_id))
})
TextileNode.eventEmitter.addListener('onThreadAdded', () => {
  store.dispatch(ThreadActions.refreshThreadsRequest())
})
TextileNode.eventEmitter.addListener('onThreadRemoved', () => {
  store.dispatch(ThreadActions.refreshThreadsRequest())
})
TextileNode.eventEmitter.addListener('onDeviceAdded', () => {
  //
})
TextileNode.eventEmitter.addListener('onDeviceRemoved', () => {
  //
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
