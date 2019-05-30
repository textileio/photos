import { CameraRoll } from 'react-native'

export function getHeight(metadata, targetWidth) {
  const known = Boolean(
    metadata &&
      metadata.height &&
      metadata.height > 0 &&
      metadata.width &&
      metadata.width > 0
  )
  const height = known
    ? (metadata.height / metadata.width) * targetWidth
    : targetWidth * 0.6
  return {
    known,
    height
  }
}

export async function getPage(pageSize, cursor) {
  const queryParams = { first: pageSize }
  if (cursor !== null) {
    queryParams.after = cursor
  }
  return CameraRoll.getPhotos(queryParams)
}
