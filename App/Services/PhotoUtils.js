import {
  CameraRoll
} from 'react-native'
import RNFS from 'react-native-fs'
import TextileNode from './TextileNode'

export function getHeight (metadata, targetWidth) {
  const known = !!(metadata && metadata.height && metadata.height > 0 && metadata.width && metadata.width > 0)
  const height = known ? (metadata.height / metadata.width) * targetWidth : targetWidth * 0.6
  return {
    known,
    height
  }
}

export async function getPage (pageSize, cursor) {
  let queryParams = { first: pageSize }
  if (cursor !== null) {
    queryParams['after'] = cursor
  }
  return CameraRoll.getPhotos(queryParams)
}

export async function getAllPhotos (limit) {
  let data = []
  let hasNextPage = true
  let cursor = undefined
  let page = 0 // I wanted to limit the total size of a return array
  let pageSize = 25
  let lessThanLimit = limit === -1 || page < limit / pageSize
  while (hasNextPage && lessThanLimit) {
    let photos = await getPage(pageSize, cursor)
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
    page += 1
    lessThanLimit = limit === -1 || page < limit / pageSize
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
    let regex = /[?&]([^=#]+)=([^&#]*)/g
    let params = {}
    let match
    do {
      match = regex.exec(photo.uri)
      if (match) {
        params[match[1]] = match[2]
      }
    } while (match)

    const path = fullDir + params.id + '.JPG'
    await RNFS.copyAssetsFileIOS(photo.uri, path, 0, 0)
    photo['path'] = path
  } else if (photo.uri.includes('content://media')) {
    // Android Method
    photo['path'] = await TextileNode.getFilePath(photo.uri)
  }
  return photo
}
