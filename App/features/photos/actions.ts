import { createAction, createAsyncAction } from 'typesafe-actions'
import { LocalPhotoResult } from '@textile/react-native-camera-roll'
import { pb } from '@textile/react-native-sdk'

export const queryCameraRoll = createAsyncAction(
  '@photos/QUERY_CAMERA_ROLL_REQUEST',
  '@photos/QUERY_CAMERA_ROLL_SUCCESS',
  '@photos/QUERY_CAMERA_ROLL_FAILURE'
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
  return (id: string, error: any) => resolve({ id, error })
})

export const refreshPhotos = createAsyncAction(
  '@photos/REFRESH_PHOTOS_REQUEST',
  '@photos/REFRESH_PHOTOS_SUCCESS',
  '@photos/REFRESH_PHOTOS_FAILURE'
)<number | undefined, ReadonlyArray<pb.IFiles>, { error: any }>()

export const loadMorePhotos = createAsyncAction(
  '@photos/LOAD_MORE_PHOTOS_REQUEST',
  '@photos/LOAD_MORE_PHOTOS_SUCCESS',
  '@photos/LOAD_MORE_PHOTOS_FAILURE'
)<number | undefined, ReadonlyArray<pb.IFiles>, { error: any }>()
