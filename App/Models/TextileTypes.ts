// BEGIN API Types

// private enums to enforce strict id types
// read here: https://basarat.gitbooks.io/typescript/docs/tips/nominalTyping.html#using-enums

import { IProcessingImageProps } from '../Components/ProcessingImage'
import { IFiles } from '@textile/react-native-sdk'

export interface PhotoType {
  type: 'photo'
  photo: IFiles
  id: string
}

export interface ProcessingItemType {
  type: 'processingItem'
  photo: IProcessingImageProps
  id: string
}

export type IPhotoGridType = PhotoType | ProcessingItemType

export interface DeepLinkData {
  readonly href: string
  readonly protocol: string
  readonly host: string
  readonly hostname: string
  readonly port: string
  readonly path: string
  readonly search: string
  readonly hash: string
}
