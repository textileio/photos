import { createAction } from 'typesafe-actions'
import { IBlock } from '@textile/react-native-sdk'

import { SharedImage, ProcessingImageError } from './models'

export const insertImage = createAction(
  'processingImages/INSERT_IMAGE',
  resolve => {
    return (
      uuid: string,
      sharedImage: SharedImage,
      destinationThreadId: string,
      comment?: string
    ) => resolve({ uuid, sharedImage, destinationThreadId, comment })
  }
)

export const addedToThread = createAction(
  'processingImages/ADDED_TO_THREAD',
  resolve => {
    return (uuid: string, block: IBlock) => resolve({ uuid, block })
  }
)

export const complete = createAction('processingImages/COMPLETE', resolve => {
  return (uuid: string) => resolve({ uuid })
})

export const retry = createAction('processingImages/RETRY', resolve => {
  return (uuid: string) => resolve({ uuid })
})

export const cancelRequest = createAction(
  'processingImages/CANCEL',
  resolve => {
    return (uuid: string) => resolve({ uuid })
  }
)

export const cancelComplete = createAction(
  'processingImages/CANCEL_COMPLETE',
  resolve => {
    return (uuid: string) => resolve({ uuid })
  }
)

export const error = createAction('processingImages/ERROR', resolve => {
  return (error: ProcessingImageError) => resolve({ error })
})
