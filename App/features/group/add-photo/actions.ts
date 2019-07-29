import { createAction, createAsyncAction } from 'typesafe-actions'
import { LocalPhotoResult } from '@textile/react-native-camera-roll'
import { IBlock } from '@textile/react-native-sdk'

import { SharedImage, SharedImagePayload } from './models'

export const queryCameraRoll = createAsyncAction(
  'addPhoto/QUERY_CAMERA_ROLL_REQUEST',
  'addPhoto/QUERY_CAMERA_ROLL_SUCCESS',
  'addPhoto/QUERY_CAMERA_ROLL_FAILURE'
)<undefined, SharedImagePayload[], { error: any }>()

export const updateLastQueriedTime = createAction(
  'addPhoto/UPDATE_LAST_QUERIED_TIME',
  resolve => {
    return (epochSeconds: number) => resolve({ epochSeconds })
  }
)

export const sharePhotoRequest = createAction(
  'addPhoto/SHARE_PHOTO_REQUEST',
  resolve => {
    return (
      sharedImage: SharedImage,
      destinationThreadId: string,
      comment?: string
    ) => resolve({ sharedImage, destinationThreadId, comment })
  }
)

export const insertPhoto = createAction('addPhoto/INSERT_PHOTO', resolve => {
  return (payload: SharedImagePayload) => resolve({ payload })
})

export const photoProcessingBegan = createAction(
  'addPhoto/PHOTO_PROCESSING_BEGAN',
  resolve => {
    return (uuid: string) => resolve({ uuid })
  }
)

export const addedToThread = createAction(
  'addPhoto/ADDED_TO_THREAD',
  resolve => {
    return (uuid: string, block: IBlock) => resolve({ uuid, block })
  }
)

export const complete = createAction('addPhoto/COMPLETE', resolve => {
  return (uuid: string) => resolve({ uuid })
})

export const retry = createAction('addPhoto/RETRY', resolve => {
  return (uuid: string) => resolve({ uuid })
})

export const cancelRequest = createAction('addPhoto/CANCEL', resolve => {
  return (uuid: string) => resolve({ uuid })
})

export const cancelComplete = createAction(
  'addPhoto/CANCEL_COMPLETE',
  resolve => {
    return (uuid: string) => resolve({ uuid })
  }
)

export const error = createAction('addPhoto/ERROR', resolve => {
  return (uuid: string, error: any) => resolve({ uuid, error })
})
