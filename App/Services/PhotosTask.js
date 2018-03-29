import RNFS from 'react-native-fs'
import IPFS from '../../TextileIPFSNativeModule'
import queueFactory from 'react-native-queue'
import {PushNotificationIOS} from 'react-native'
import BackgroundTimer from 'react-native-background-timer'
import PhotosQuery from './PhotosQuery'

export default async function photosTask () {
  BackgroundTimer.start() // This requests some background time from the OS

  // Start IPFS
  const path = RNFS.DocumentDirectoryPath
  IPFS.createNodeWithDataDir(path, 'https://ipfs.textile.io')
  await IPFS.startNode()

  // Init queue
  const queue = await queueFactory()

  // Register job worker
  queue.addWorker('add-image', async (id, photo) => {
    if (photo.node.image.path) {
      console.log('PINNING IMAGE:', photo.node.image.path)
      await IPFS.addImageAtPath(photo.node.image.path)
      console.log('PINNED IMAGE:', photo.node.image.path)
      PushNotificationIOS.presentLocalNotification({
        alertBody: 'pinned image ' + photo.node.image.path,
        userInfo: {}
      })
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

  BackgroundTimer.stop() // This alerts the OS that we're done with our background task
}
