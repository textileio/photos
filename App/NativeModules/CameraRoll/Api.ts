import { NativeModules } from 'react-native'

const { CameraRoll } = NativeModules

export async function requestLocalPhotos(minEpoch: number): Promise<void> {
  return await CameraRoll.requestLocalPhotos(Math.round(minEpoch / 1000))
}
