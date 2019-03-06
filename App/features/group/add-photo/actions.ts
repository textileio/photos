import { createAction } from 'typesafe-actions'
import { pb } from '@textile/react-native-sdk'

import { SharedImage, ProcessingImageError } from './models'

export const insertImage = createAction('processingImages/INSERT_IMAGE', (resolve) => {
  return (uuid: string, sharedImage: SharedImage, destinationThreadId: string, comment?: string) => resolve({ uuid, sharedImage, destinationThreadId, comment })
})

export const imagePrepared = createAction('processingImages/IMAGE_PREPARED', (resolve) => {
  return (uuid: string, preparedFiles: pb.IMobilePreparedFiles) => resolve({ uuid, preparedFiles })
})

export const uploadStarted = createAction('processingImages/UPLOAD_STARTED', (resolve) => {
  return (uuid: string, uploadId: string) => resolve({ uuid, uploadId })
})

export const imageUploadProgress = createAction('processingImages/IMAGE_UPLOAD_PROGRESS', (resolve) => {
  return (uploadId: string, progress: number) => resolve({ uploadId, progress })
})

export const imageUploadComplete = createAction('processingImages/IMAGE_UPLOAD_COMPLETE', (resolve) => {
  return (uploadId: string, responseCode: string, responseBody: string) => resolve({ uploadId, responseCode, responseBody })
})

export const sharedToThread = createAction('processingImages/SHARED_TO_THREAD', (resolve) => {
  return (uuid: string, block: pb.IBlock) => resolve({ uuid, block })
})

export const complete = createAction('processingImages/COMPLETE', (resolve) => {
  return (uuid: string) => resolve({ uuid })
})

export const retry = createAction('processingImages/RETRY', (resolve) => {
  return (uuid: string) => resolve({ uuid })
})

export const cancelRequest = createAction('processingImages/CANCEL', (resolve) => {
  return (uuid: string) => resolve({ uuid })
})

export const cancelComplete = createAction('processingImages/CANCEL_COMPLETE', (resolve) => {
  return (uuid: string) => resolve({ uuid })
})

export const error = createAction('processingImages/ERROR', (resolve) => {
  return (error: ProcessingImageError) => resolve({ error })
})
