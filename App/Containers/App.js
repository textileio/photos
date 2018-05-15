import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import Actions from '../Redux/TextileRedux'
import IPFSActions from '../Redux/IpfsNodeRedux'
import BackgroundTask from 'react-native-background-task'
import IPFS from '../../TextileIPFSNativeModule'
import Analytics from 'appcenter-analytics'

// create our store
const { store, persistor } = createStore()
Analytics.trackEvent("STARTUP FUNCTION")

// const API_URL = 'https://api.textile.io'
// const debugLevel = (__DEV__ ? "DEBUG" : "INFO")
// const path = RNFS.DocumentDirectoryPath
// const createNodeSuccess = yield call(IPFS.createNodeWithDataDir, path, API_URL, debugLevel)

BackgroundTask.define(() => {
  store.dispatch(Actions.backgroundTask())
})

// subscribe to thread updates
// NOTE: we may want to cancel listener with the returned handle at some point with subscription.remove()
IPFS.eventEmitter.addListener('onThreadUpdate', (payload) => {
  store.dispatch(IPFSActions.getPhotoHashesRequest(payload.thread))
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
