import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import { PushNotificationIOS } from 'react-native'
import { Provider } from 'react-redux'
import BackgroundTask from 'react-native-background-task'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import Photos from '../Services/Photos'
import PhotosTask from '../Services/PhotosTask'

BackgroundTask.define(async () => {
  console.log('RUNNING BACKGROUND TASK!')
  await PhotosTask()
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

  photos: Photos

  constructor(props) {
    super(props)
    this.setup()
  }

  componentDidMount() {
    BackgroundTask.schedule()
  }

  async setup() {
    PushNotificationIOS.requestPermissions()

    navigator.geolocation.watchPosition(
      position => {
        console.log('Got a new position')
        PushNotificationIOS.presentLocalNotification({
          alertBody: 'GOT LOCATION UPDATE ',
          userInfo: {}
        })
        PhotosTask()
          .then(() => {
            console.log('done running photos task')
          })
      },
      error => {
        console.log('Got a location error', error)
      },
      { useSignificantChanges: true }
    )

    // this.photos = new Photos()
    // const autoPhotos: boolean = true // TODO: Get this from some stored preferences
    // const path = RNFS.DocumentDirectoryPath
    // IPFS.createNodeWithDataDir(path, 'https://ipfs.textile.io')
    // try {
    //   await IPFS.startNode()
    //   if (autoPhotos) {
    //     this.photos = new Photos()
    //   }
    // } catch(error) {
    //   console.log('ERROR IN IPFS/PHOTOS SETUP:', error)
    //   return
    // }
    // console.log('IPFS/PHOTOS SETUP DONE')
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
