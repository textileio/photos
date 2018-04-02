import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import {PushNotificationIOS, AppState} from 'react-native'
import {Provider} from 'react-redux'
import BackgroundTask from 'react-native-background-task'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import PhotosTask from '../Services/PhotosTask'
import {getPhoto} from '../Services/PhotoUtils'

BackgroundTask.define(async () => {
  console.log('running background task')
  PushNotificationIOS.presentLocalNotification({
    alertBody: 'RUNNING BACKGROUND FETCH',
    userInfo: {}
  })
  await PhotosTask(store.dispatch)
  // finish() must be called before OS hits timeout.
  BackgroundTask.finish()
})

// create our store
const store = createStore()

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

  constructor(props) {
    super(props)
    AppState.addEventListener('change', this.handleAppStateChange)
    this.setup()
  }

  componentDidMount() {
    BackgroundTask.schedule()
  }

  async setup() {
    await PushNotificationIOS.requestPermissions()
    await getPhoto() // Trigger photos permission prompt

    navigator.geolocation.watchPosition(
      () => {
        console.log('got a new position')
        PushNotificationIOS.presentLocalNotification({
          alertBody: 'GOT LOCATION UPDATE',
          userInfo: {}
        })
        PhotosTask(store.dispatch)
      },
      error => {
        console.log('Got a location error', error)
      },
      { useSignificantChanges: true }
    )
  }

  async handleAppStateChange(nextAppState) {
    if (nextAppState.match(/^active/)) {
      console.log('got a foreground event')
      await PhotosTask(store.dispatch)
    }
  }

  render () {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}

// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App
