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
  // PushNotificationIOS.presentLocalNotification({
  //   alertBody: 'fetch of ' + photos.length + ' photos',
  //   userInfo: {}
  // })
  for (const photo of photos) {
    const multipartData = await IPFS.addImageAtPath(photo.node.image.path, photo.node.image.thumbPath)
    await RNFS.unlink(photo.node.image.path)
    await RNFS.unlink(photo.node.image.thumbPath)
    photo.node.image['hash'] = multipartData.boundary
    dispatch(Actions.imageAdded(photo, multipartData.payloadPath))
    UploadTask.uploadFile(multipartData.payloadPath, 'https://ipfs.textile.io/api/v0/add?wrap-with-directory=true', 'POST', multipartData.boundary)

    // PushNotificationIOS.presentLocalNotification({
    //   alertBody: 'uploading photo ' + multipartData.payloadPath,
    //   userInfo: {}
    // })
  }

  // PushNotificationIOS.presentLocalNotification({
  //   alertBody: 'photos task done',
  //   userInfo: {}
  // })
  console.log('photos task done')

  BackgroundTimer.stop() // This alerts the OS that we're done with our background task
}
