import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import PhotosTask from '../Services/PhotosTask'
import { PushNotificationIOS } from 'react-native'
import BackgroundTask from 'react-native-background-task'

// create our store
const { store, persistor } = createStore()

export const getFailedImages = () => {
  return store.getState().textile.images.items.filter(image => {
    return image.state === 'error'
  })
}

BackgroundTask.define(async () => {
  console.log('running background task')
  // PushNotificationIOS.presentLocalNotification({
  //   alertBody: 'running background fetch',
  //   userInfo: {}
  // })
  await PhotosTask(store.dispatch, getFailedImages())
  // finish() must be called before OS hits timeout.
  BackgroundTask.finish()
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
