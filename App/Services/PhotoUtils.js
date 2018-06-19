import {
  CameraRoll
} from 'react-native'
import RNFS from 'react-native-fs'
import TextileNode from '../../TextileNodeNativeModule'

export async function getPage (pageSize, cursor) {
  let queryParams = { first: pageSize }
  if (cursor !== null) {
    queryParams['after'] = cursor
  }
  return CameraRoll.getPhotos(queryParams)
}

export async function getAllPhotos () {
  let data = []
  let hasNextPage = true
  let cursor = null
  let totalPages = 25 // I wanted to limit the total size of a return array
  while (hasNextPage && totalPages) {
    let photos = await getPage(25, cursor)
    hasNextPage = photos.page_info.has_next_page
    cursor = photos.page_info.end_cursor
    data = data.concat(photos.edges.map((photo) => {
      // todo: hang on to location data
      return {
        timestamp: photo.node.timestamp,
        uri: photo.node.image.uri,
        width: photo.node.image.width,
        height: photo.node.image.height
      }
    }))
    totalPages -= 1
  }
  return data
}

export async function getPhotoPath (photo) {
  const fullDir = RNFS.DocumentDirectoryPath + '/images/full/'
  const fullExists = await RNFS.exists(fullDir)
  if (!fullExists) {
    await RNFS.mkdir(fullDir)
  }

  // iOS method
  if (photo.uri.includes('assets-library://')) {
    let regex = /[?&]([^=#]+)=([^&#]*)/g, params = {}, match
    while (match = regex.exec(photo.uri)) {
      params[match[1]] = match[2]
    }
    const path = fullDir + params.id + '.JPG'
    await RNFS.copyAssetsFileIOS(photo.uri, path, 0, 0)
    photo['path'] = path
  }
  // Android Method
  else if (photo.uri.includes('content://media')) {
    photo['path'] = await TextileNode.getFilePath(photo.uri)
  }
  return photo
}
