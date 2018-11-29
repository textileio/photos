// BEGIN API Types

// private enums to enforce strict id types
// read here: https://basarat.gitbooks.io/typescript/docs/tips/nominalTyping.html#using-enums

import {IProcessingImageProps} from '../Components/ProcessingImage'
import { ThreadFilesInfo } from '../NativeModules/Textile'

export interface IPhotoGridType {
  type: 'photo' | 'processingItem'
  photo: ThreadFilesInfo | IProcessingImageProps
  id: string
}

export interface SharedImage {
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
