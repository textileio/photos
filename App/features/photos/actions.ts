import { createAction, createAsyncAction } from 'typesafe-actions'
import { LocalPhotoResult } from '@textile/react-native-camera-roll'
import { pb } from '@textile/react-native-sdk'

export const queryPhotos = createAsyncAction(
  '@photos/QUERY_PHOTOS_REQUEST',
  '@photos/QUERY_PHOTOS_SUCCESS',
  '@photos/QUERY_PHOTOS_FAILURE'
)<undefined, LocalPhotoResult[], { error: any }>()

export const updateLastQueriedTime = createAction('@photos/UPDATE_LAST_QUERIED_TIME', (resolve) => {
  return (epochSeconds: number) => resolve({ epochSeconds })
})

export const photoPrepared = createAction('@photos/PHOTO_PREPARED', (resolve) => {
  return (id: string, preparedFiles: pb.IMobilePreparedFiles) => resolve({ id, preparedFiles })
})

export const photoAdded = createAction('@photos/PHOTO_ADDED', (resolve) => {
  return (id: string) => resolve({ id })
})

export const photoCleanedUp = createAction('@photos/PHOTO_CLEANED_UP', (resolve) => {
  return (id: string) => resolve({ id })
})

export const photoProcessingError = createAction('@photos/PHOTO_PROCESSING_ERROR', (resolve) => {
  return (error: any) => resolve({ error })
})
