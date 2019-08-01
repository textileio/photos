import { IBlock } from '@textile/react-native-sdk'

import { IProcessingImageProps } from '../../../Components/ProcessingImage'

export interface SharedImage {
  origURL?: string
  uri: string
  path: string
}

export interface SharedImagePayload {
  uuid: string
  sharedImage: SharedImage
  destinationThreadId: string
  comment?: string
}

export interface ProcessingImage extends SharedImagePayload {
  readonly status: 'pending' | 'adding' | 'complete'
  readonly block?: IBlock
  readonly error?: string
}

export interface AddingPhotoItem {
  readonly type: 'addingPhoto'
  readonly key: string
  readonly data: IProcessingImageProps
}
