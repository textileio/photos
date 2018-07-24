import { CameraRoll } from 'react-native'

export async function getPhotos (first: number = -1): Promise<string[]> {
  const result = await CameraRoll.getPhotos({ first })
  const items = result.edges.map(edge => edge.node.image.uri)
  return items
}