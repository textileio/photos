import RNFS from 'react-native-fs'
import IPFS from '../../TextileIPFSNativeModule'
import queueFactory from 'react-native-queue'
import {PushNotificationIOS} from 'react-native'
import BackgroundTimer from 'react-native-background-timer'
import {queryPhotos} from './PhotoUtils'
import Actions from '../Redux/TextileRedux'

export default async function photosTask (dispatch, failedImages) {
  console.log('FAILED IMAGES:', failedImages)
  console.log('running photos task')
  BackgroundTimer.start() // This requests some background time from the OS

  // Start IPFS
  const path = RNFS.DocumentDirectoryPath
  IPFS.createNodeWithDataDir(path, 'https://ipfs.textile.io')
  await IPFS.startNode()

  // Init queue
  const queue = await queueFactory()

  // Register job worker
  queue.addWorker('add-image', async (id, image) => {
    console.log('running add-image worker:', id)
    dispatch(Actions.imageProcessing(image))
    if (image.node.image.path) {
      try {
        const hash = await IPFS.addImageAtPath(image.node.image.path, image.node.image.thumbPath)
        dispatch(Actions.imageSuccess(image, hash))
        PushNotificationIOS.presentLocalNotification({
          alertBody: 'added image: ' + hash,
          userInfo: {}
        })
      } catch (e) {
        dispatch(Actions.imageError(image, e))
        console.log('WORKER ERROR:', e)
        PushNotificationIOS.presentLocalNotification({
          alertBody: 'error: ' + e.message,
          userInfo: {}
        })
        throw e
      }
      console.log('done running add-image worker:', id)
    }
  })

  // Get a list of the jobs already in the queue
  // const existingJobs = await queue.getJobs(true)

  // Query for any new photos, add jobs to queue
  const photos = await queryPhotos()
  PushNotificationIOS.presentLocalNotification({
    alertBody: 'fetch of ' + photos.length + ' photos',
    userInfo: {}
  })
  for (const photo of photos) {
    dispatch(Actions.imageAdded(photo))
    queue.createJob(
      'add-image',
      photo,
      { attempts: 1, timeout: 20000 },
      false
    )
  }

  // If our failedImages aren't already queued up for re-processing, add them to the end of the queue now
  // const existingJobImagePaths = existingJobs.map(job => {
  //   const item = JSON.parse(job.payload)
  //   return item.node.image.path
  // })
  // for (const failedImage of failedImages) {
  //   if (!existingJobImagePaths.includes(failedImage.image.node.image.path)) {
  //     // Dispatch an action?
  //     queue.createJob(
  //       'add-image',
  //       failedImage.image,
  //       { attempts: 1, timeout: 20000 },
  //       false
  //     )
  //   }
  // }

  // Start the queue with a lifespan
  // IMPORTANT: OS background tasks are limited to 30 seconds or less.
  // NOTE: Queue lifespan logic will attempt to stop queue processing 500ms less than passed lifespan for a healthy shutdown buffer.
  // IMPORTANT: Queue processing started with a lifespan will ONLY process jobs that have a defined timeout set.
  // Additionally, lifespan processing will only process next job if job.timeout < (remainingLifespan - 500).
  await queue.start(25000) // Run queue for at most 25 seconds.

  PushNotificationIOS.presentLocalNotification({
    alertBody: 'job queue stopped',
    userInfo: {}
  })

  BackgroundTimer.stop() // This alerts the OS that we're done with our background task
  console.log('done running photos task')
}
