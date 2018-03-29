import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import { PushNotificationIOS } from 'react-native'
import { Provider } from 'react-redux'
import BackgroundTask from 'react-native-background-task'
import queueFactory from 'react-native-queue'
import RootContainer from './RootContainer'
import createStore from '../Redux'
import Photos from '../Services/Photos'
import PhotosQuery from '../Services/PhotosQuery'
import RNFS from 'react-native-fs'
import IPFS from '../../TextileIPFSNativeModule'

BackgroundTask.define(async () => {
  console.log('RUNNING BACKGROUND TASK!')
  // Start IPFS
  const path = RNFS.DocumentDirectoryPath
  IPFS.createNodeWithDataDir(path, 'https://ipfs.textile.io')
  await IPFS.startNode()

  // Init queue
  const queue = await queueFactory();

  // Register job worker
  queue.addWorker('add-image', async (id, photo) => {
    if (photo.node.image.path) {
      await IPFS.addImageAtPath(photo.node.image.path)
    }
  })

  // Query for any new photos, add jobs to queue
  const photos = await PhotosQuery()
  PushNotificationIOS.presentLocalNotification({
    alertBody: 'background fetch of ' + photos.length + ' photos',
    userInfo: {}
  })
  for (const photo of photos) {
    queue.createJob(
      'add-image',
      photo,
      { attempts: 2, timeout: 20000 },
      false
    )
  }

  // Start the queue with a lifespan
  // IMPORTANT: OS background tasks are limited to 30 seconds or less.
  // NOTE: Queue lifespan logic will attempt to stop queue processing 500ms less than passed lifespan for a healthy shutdown buffer.
  // IMPORTANT: Queue processing started with a lifespan will ONLY process jobs that have a defined timeout set.
  // Additionally, lifespan processing will only process next job if job.timeout < (remainingLifespan - 500).
  await queue.start(25000) // Run queue for at most 25 seconds.

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
