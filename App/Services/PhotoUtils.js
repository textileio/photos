import {
  CameraRoll
} from 'react-native'
import RNFS from 'react-native-fs'
import ImageResizer from 'react-native-image-resizer'
import IPFS from '../../TextileIPFSNativeModule'

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
  let totalPages = 50 // I wanted to limit the total size of a return array
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

export async function scalePhotos (photos) {
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
  }
  return photos
}

export async function resizeImage (path: string, outputPath: string, width: number = 400, height: number = 400): string {
  const result = await ImageResizer.createResizedImage(path, width, height, 'JPEG', 80, 0, outputPath)
  return result.path
}
