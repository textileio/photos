import { NativeModules } from 'react-native'

const { TextileNode } = NativeModules

export async function requestLocalPhotos(minEpoch: number): Promise<void> {
  return await TextileNode.requestLocalPhotos(Math.round(minEpoch / 1000))
}
