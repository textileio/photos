import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React from 'react'
import { Component } from 'react'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import Actions from '../Redux/TextileRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import BackgroundTask from 'react-native-background-task'
import TextileNode from '../../TextileNode'

// create our store
const { store, persistor } = createStore()

BackgroundTask.define(() => {
  store.dispatch(Actions.backgroundTask())
})

// subscribe to native events
// NOTE: we may want to cancel listener with the returned handle at some point with subscription.remove()
TextileNode.eventEmitter.addListener('onOnline', () => {
  // TODO: show some UI? "p2p online"?
})
// TODO: add types to event emitter if possible
TextileNode.eventEmitter.addListener('onThreadUpdate', (payload) => {
  store.dispatch(TextileNodeActions.getPhotoHashesRequest(payload.thread))
})

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
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

// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron ? console.tron.overlay(App) : App
