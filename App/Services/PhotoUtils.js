import {
  CameraRoll,
  AsyncStorage
} from 'react-native'
import RNFS from 'react-native-fs'
import ImageResizer from 'react-native-image-resizer'

export async function queryPhotos () {
  const latestPhotoQueried = await AsyncStorage.getItem('latestPhotoQueried')
  let photos = []
  if (latestPhotoQueried === null) {
    // If we've never queried a photo, just record the newest photo and we'll start from there next time
    const latestPhoto = await getPhoto()
    console.log('NO PREVIOUS PHOTOS QUERIED, SAVING ID:', latestPhoto.pageInfo.end_cursor)
    await AsyncStorage.setItem('latestPhotoQueried', latestPhoto.pageInfo.end_cursor)
  } else {
    // We have a latest photo, so start getting photos until we get to the latest
    let cursor = null // Start with null to get the latest
    let hasNextPage = true
    while (cursor !== latestPhotoQueried && hasNextPage) {
      const photo = await getPhoto(cursor)
      // If the photo we query is the same as the latestPhotoQueried, there is no new photo, break out
      if (photo.pageInfo.end_cursor === latestPhotoQueried) {
        break
      }
      photos.push(photo)
      cursor = photo.pageInfo.end_cursor
      hasNextPage = photo.pageInfo.has_next_page
    }
    if (photos.length > 0) {
      const cursor = photos[0].pageInfo.end_cursor
      await AsyncStorage.setItem('latestPhotoQueried', cursor)
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

  /*
  TODO: Move photo copying and resizing out of here. It should only be done
   for photos that were not previously processed, and having this code here
   causes the latest already procecessed photo to be copied and resized again.
  */
  if (node.image.uri.includes('assets-library://')) {
    var regex = /[?&]([^=#]+)=([^&#]*)/g, params = {}, match
    while (match = regex.exec(node.image.uri)) {
      params[match[1]] = match[2]
    }
    const fullDir = RNFS.DocumentDirectoryPath + '/images/full/'
    const thumbRelativeDir = 'images/thumb/'
    const thumbDir = RNFS.DocumentDirectoryPath + '/' + thumbRelativeDir
    const fullExists = await RNFS.exists(fullDir)
    if (!fullExists) {
      await RNFS.mkdir(fullDir)
    }
    const thumbExists = await RNFS.exists(thumbDir)
    if (!thumbExists) {
      await RNFS.mkdir(thumbDir)
    }
    const path = fullDir + params.id + '.' + params.ext
    await RNFS.copyAssetsFileIOS(node.image.uri, path, 0, 0)
    node.image['path'] = path
    const thumbPath = await resizeImage(path, thumbRelativeDir)
    node.image['thumbPath'] = thumbPath
  }
  return { node: node, pageInfo: photosData.page_info }
}

export async function resizeImage (path: string, outputPath: string, width: number = 400, height: number = 400): string {
  console.log('RESIZING IMAGE', path)
  const result = await ImageResizer.createResizedImage(path, width, height, 'JPEG', 80, 0, outputPath)
  return result.path
}
