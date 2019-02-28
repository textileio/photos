import { createAction, createAsyncAction } from 'typesafe-actions'

export const queryPhotos = createAsyncAction(
  '@photos/QUERY_PHOTOS_REQUEST',
  '@photos/QUERY_PHOTOS_SUCCESS',
  '@photos/QUERY_PHOTOS_FAILURE'
)<undefined, undefined, { error: any }>()

export const updateLastQueriedTime = createAction('@photos/UPDATE_LAST_QUERIED_TIME', (resolve) => {
  return (epochSeconds: number) => resolve({ epochSeconds })
})
