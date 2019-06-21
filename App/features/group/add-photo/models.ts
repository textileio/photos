import { IBlock } from '@textile/react-native-sdk'

import { IProcessingImageProps } from '../../../Components/ProcessingImage'

export interface SharedImage {
  isAvatar: boolean
  origURL?: string
  uri: string
  path: string
  canDelete: boolean
}

export interface GeneralError {
  uuid: string
  underlyingError: any
  type: 'general'
}

export type ProcessingImageError = GeneralError

export interface ProcessingImage {
  readonly uuid: string
  readonly sharedImage: SharedImage
  readonly status: 'adding' | 'complete'
  readonly destinationThreadId: string
  readonly comment?: string
  readonly block?: IBlock
  readonly error?: string
}

export interface AddingPhotoItem {
  readonly type: 'addingPhoto'
  readonly key: string
  readonly data: IProcessingImageProps
}
