import Config from 'react-native-config'
import { Buffer } from 'buffer'

export interface Cafe {
  name: string
  peerId: string
  token: string
}

const cafesBase64 = Config.RN_TEXTILE_CAFES_JSON
const cafesString = new Buffer(cafesBase64, 'base64').toString()

export const cafes: Cafe[] = JSON.parse(cafesString)

export const cafesMap = cafes.reduce(
  (acc, current) => {
    return { ...acc, [current.peerId]: current }
  },
  {} as { [key: string]: Cafe | undefined }
)
