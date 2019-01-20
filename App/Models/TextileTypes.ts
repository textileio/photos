// BEGIN API Types

// private enums to enforce strict id types
// read here: https://basarat.gitbooks.io/typescript/docs/tips/nominalTyping.html#using-enums

import {IProcessingImageProps} from '../Components/ProcessingImage'
import { ThreadFilesInfo } from '@textile/react-native-sdk'

export interface PhotoType {
  type: 'photo',
  photo: ThreadFilesInfo
  id: string
}

export interface ProcessingItemType {
  type: 'processingItem',
  photo: IProcessingImageProps
  id: string
}

export type IPhotoGridType = PhotoType | ProcessingItemType

export interface SharedImage {
  isAvatar: boolean,
  origURL?: string,
  uri: string,
  path: string,
  canDelete: boolean
}

export interface DeepLinkData {
  readonly href: string,
  readonly protocol: string,
  readonly host: string,
  readonly hostname: string,
  readonly port: string,
  readonly path: string,
  readonly search: string
  readonly hash: string
}

export interface ILocalPhotoResult {
  assetId: string,
  creationDate: string,
  modificationDate: string,
  orientation: number,
  path: string,
  uri: string,
  canDelete: boolean
}
