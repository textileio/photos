import {
  CameraRoll,
  AsyncStorage
} from 'react-native'
import RNFS from 'react-native-fs'

export default async () => {
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
      const photo = await this.getPhoto(cursor)
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

async function getPhoto (cursor) {
  let queryParams = { first: 1 }
  if (cursor !== null) {
    queryParams['after'] = cursor
  }
  const photosData = await CameraRoll.getPhotos(queryParams)
  if (photosData.edges.length < 1) {
    return
  }
  var node = photosData.edges[0].node
  if (node.image.uri.includes('assets-library://')) {
    var regex = /[?&]([^=#]+)=([^&#]*)/g, params = {}, match
    while (match = regex.exec(node.image.uri)) {
      params[match[1]] = match[2]
    }
    const path = RNFS.DocumentDirectoryPath + '/pendingPhotos/' + params.id + '.' + params.ext
    await RNFS.copyAssetsFileIOS(node.image.uri, path, 0, 0)
    node.image['path'] = path
  }
  return { node: node, pageInfo: photosData.page_info }
}
