import { pb } from '@textile/react-native-sdk'

import { IProcessingImageProps } from '../../../Components/ProcessingImage'

export interface SharedImage {
  isAvatar: boolean,
  origURL?: string,
  uri: string,
  path: string,
  canDelete: boolean
}

export interface GeneralError {
  uuid: string
  underlyingError: any
  type: 'general'
}

export interface ExpiredTokenError {
  uuid: string
  uploadId: string
  underlyingError: 'expired token'
  type: 'expiredToken'
}

interface UploadError {
  uuid: string
  uploadId: string
  underlyingError: any
  type: 'upload'
}

export type ProcessingImageError = GeneralError | ExpiredTokenError | UploadError

export interface Upload {
  readonly id: string
  readonly path: string
  readonly status: 'pending' | 'uploading' | 'complete' | 'error'
  readonly uploadProgress: number
  readonly responseCode?: string
  readonly responseBody?: string
  readonly error?: string
}
export interface UploadData {
  [key: string]: Upload
}

export interface ProcessingImage {
  readonly uuid: string,
  readonly sharedImage: SharedImage
  readonly status: 'preparing'  | 'uploading' | 'sharing' | 'complete'
  readonly destinationThreadId: string
  readonly comment?: string
  readonly preparedFiles?: pb.IMobilePreparedFiles
  readonly uploadData?: UploadData
  readonly block?: pb.IBlock
  readonly error?: string
}

export interface AddingPhotoItem {
  readonly type: 'addingPhoto'
  readonly key: string
  readonly data: IProcessingImageProps
}
