import { CameraRoll } from 'react-native'

export async function foo () {
  console.log('STARTING PHOTO QUERY')
  const result = await CameraRoll.getPhotos({ first: -1 })
  console.log('QUERIED PHOTOS:', result.edges.length)
}