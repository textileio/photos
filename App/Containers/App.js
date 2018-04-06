import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import {PushNotificationIOS, AppState} from 'react-native'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import BackgroundTask from 'react-native-background-task'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import PhotosTask from '../Services/PhotosTask'
import {getPhoto} from '../Services/PhotoUtils'
import UploadTask from '../../UploadTaskNativeModule'
import Actions from '../Redux/TextileRedux'

BackgroundTask.define(async () => {
  console.log('running background task')
  PushNotificationIOS.presentLocalNotification({
    alertBody: 'running background fetch',
    userInfo: {}
  })
  await PhotosTask(store.dispatch, getFailedImages())
  // finish() must be called before OS hits timeout.
  BackgroundTask.finish()
})

// create our store
const { store, persistor } = createStore()

const getFailedImages = () => {
  const images = store.getState().textile.images.items.filter(image => {
    return image.state === 'error'
  })
  return images
}

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

  componentWillUnmount() {
    this.progressSubscription.remove()
    this.completionSubscription.remove()
  }

  async setup() {
    this.progressSubscription = UploadTask.uploadTaskEmitter.addListener('UploadTaskProgress', event => {
      console.log('UPLOAD PROGRESS:', event)
      store.dispatch(Actions.imageUploadProgress(event))
    })

    this.completionSubscription = UploadTask.uploadTaskEmitter.addListener('UploadTaskComplete', event => {
      console.log('UPLOAD COMPLETE:', event)
      PushNotificationIOS.presentLocalNotification({
        alertBody: 'upload complete',
        userInfo: {}
      })
      store.dispatch(Actions.imageUploadComplete(event))
    })

    await PushNotificationIOS.requestPermissions()
    await getPhoto() // Trigger photos permission prompt

    navigator.geolocation.watchPosition(
      () => {
        console.log('got a new position')
        PushNotificationIOS.presentLocalNotification({
          alertBody: 'location update',
          userInfo: {}
        })
        PhotosTask(store.dispatch, getFailedImages())
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
      await PhotosTask(store.dispatch, getFailedImages())
    }
  }

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
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App
