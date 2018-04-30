import {
  CameraRoll,
  AsyncStorage
} from 'react-native'
import RNFS from 'react-native-fs'
import ImageResizer from 'react-native-image-resizer'
import IPFS from '../../TextileIPFSNativeModule'

export async function queryPhotos () {
  const latestTimestampString = await AsyncStorage.getItem('latestPhotoTimestamp')
  const seed = await getPhoto() // Get the newest photo
  let photos = []
  if (!latestTimestampString) {
    // If we've never queried a photo before, just record the newest photo timestamp
    // or the current time and we'll start from there next time
    let timestamp = seed ? new Date(seed.photo.timestamp * 1000) : new Date()
    console.log('NO PREVIOUS PHOTOS QUERIED, SAVING TIMESTAMP:', timestamp.toISOString())
    await AsyncStorage.setItem('latestPhotoTimestamp', timestamp.toISOString())
  } else {
    if (!seed) {
      return photos
    }
    const latestTimestamp = Date.parse(latestTimestampString)
    let currentPhoto = seed
    let currentTimestamp = new Date(currentPhoto.photo.timestamp * 1000)
    while (currentTimestamp > latestTimestamp) {
      photos.push(currentPhoto.photo)
      if (!currentPhoto.pageInfo.has_next_page) {
        break
      }
      currentPhoto = await getPhoto(currentPhoto.pageInfo.end_cursor)
      currentTimestamp = new Date(currentPhoto.photo.timestamp * 1000)
    }
    if (photos.length > 0) {
      const fullDir = RNFS.DocumentDirectoryPath + '/images/full/'
      const fullExists = await RNFS.exists(fullDir)
      if (!fullExists) {
        await RNFS.mkdir(fullDir)
      }
      const thumbRelativeDir = 'images/thumb/'
      const thumbDir = RNFS.DocumentDirectoryPath + '/' + thumbRelativeDir
      const thumbExists = await RNFS.exists(thumbDir)
      if (!thumbExists) {
        await RNFS.mkdir(thumbDir)
      }
      for (const photo of photos) {
        // iOS method
        if (photo.uri.includes('assets-library://')) {
          var regex = /[?&]([^=#]+)=([^&#]*)/g, params = {}, match
          while (match = regex.exec(photo.uri)) {
            params[match[1]] = match[2]
          }
          const path = fullDir + params.id + '.' + params.ext
          await RNFS.copyAssetsFileIOS(photo.uri, path, 0, 0)
          photo['path'] = path
          const thumbPath = await resizeImage(photo.path, thumbRelativeDir)
          photo['thumbPath'] = thumbPath
        }
        // Android Method
        else if (photo.uri.includes('content://media')) {
          photo['path'] = await IPFS.getFilePath(photo.uri)
          photo['thumbPath'] = await resizeImage(photo.path, thumbDir)
        }
      }
      const newestPhotoTimestampString = photos[0].timestamp
      const newestPhotoTimestamp = new Date(newestPhotoTimestampString * 1000)
      await AsyncStorage.setItem('latestPhotoTimestamp', newestPhotoTimestamp.toISOString())
    }
  }
  return photos
}

export async function getPhoto (cursor) {
  let queryParams = { first: 1 }
  if (cursor !== null) {
    queryParams['after'] = cursor
  }
  const photosData = await CameraRoll.getPhotos(queryParams)
  if (photosData.edges.length < 1) {
    return
  }
  var node = photosData.edges[0].node
  return {
    photo: {
      timestamp: node.timestamp,
      uri: node.image.uri,
      width: node.image.width,
      height: node.image.height
    },
    pageInfo: photosData.page_info
  }
}

export async function resizeImage (path: string, outputPath: string, width: number = 400, height: number = 400): string {
  const result = await ImageResizer.createResizedImage(path, width, height, 'JPEG', 80, 0, outputPath)
  return result.path
}
