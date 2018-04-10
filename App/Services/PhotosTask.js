import RNFS from 'react-native-fs'
import IPFS from '../../TextileIPFSNativeModule'
import {PushNotificationIOS} from 'react-native'
import BackgroundTimer from 'react-native-background-timer'
import {queryPhotos} from './PhotoUtils'
import Actions from '../Redux/TextileRedux'
import UploadTask from '../../UploadTaskNativeModule'

export default async function photosTask (dispatch, failedImages) {
  // console.log('FAILED IMAGES:', failedImages)
  console.log('running photos task')
  BackgroundTimer.start() // This requests some background time from the OS

  // Start IPFS
  const path = RNFS.DocumentDirectoryPath
  await IPFS.createNodeWithDataDir(path)
  await IPFS.startNode()

  // Get a list of the jobs already in the queue
  // const existingJobs = await queue.getJobs(true)

  // Query for any new photos, add jobs to queue
  const photos = await queryPhotos()
  PushNotificationIOS.presentLocalNotification({
    alertBody: 'fetch of ' + photos.length + ' photos',
    userInfo: {}
  })
  for (const photo of photos) {
    const multipartData = await IPFS.addImageAtPath(photo.node.image.path, photo.node.image.thumbPath)
    UploadTask.uploadFile(multipartData.payloadPath, 'https://ipfs.textile.io/api/v0/add?wrap-with-directory=true', 'POST', multipartData.boundary)
    dispatch(Actions.imageAdded(photo, multipartData.payloadPath))

    PushNotificationIOS.presentLocalNotification({
      alertBody: 'uploading photo ' + multipartData.payloadPath,
      userInfo: {}
    })

    // console.log('running add-image worker:', id)
    // dispatch(Actions.imageProcessing(image))
    // if (image.node.image.path) {
    //   try {
    //     const hash = await IPFS.addImageAtPath(image.node.image.path, image.node.image.thumbPath)
    //     dispatch(Actions.imageSuccess(image, hash))
    //     PushNotificationIOS.presentLocalNotification({
    //       alertBody: 'added image: ' + hash,
    //       userInfo: {}
    //     })
    //   } catch (e) {
    //     dispatch(Actions.imageError(image, e))
    //     console.log('WORKER ERROR:', e)
    //     PushNotificationIOS.presentLocalNotification({
    //       alertBody: 'error: ' + e.message,
    //       userInfo: {}
    //     })
    //     throw e
    //   }
    //   console.log('done running add-image worker:', id)
    // }
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

  PushNotificationIOS.presentLocalNotification({
    alertBody: 'photos task done',
    userInfo: {}
  })
  console.log('photos task done')

  BackgroundTimer.stop() // This alerts the OS that we're done with our background task
}
