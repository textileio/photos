import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import * as actions from './actions'
import { ProcessingPhotos, ProcessingPhoto } from './models'

export interface PhotosState {
  readonly queryData: {
    readonly lastQueriedTime?: number
    readonly querying: boolean
    readonly error?: string
  },
  readonly processingPhotos: ProcessingPhotos
}

export type PhotosAction = ActionType<typeof actions>

export default combineReducers<PhotosState, PhotosAction>({
  queryData: (state = { querying: false }, action) => {
    switch (action.type) {
      case getType(actions.queryPhotos.request): {
        return { ...state, querying: true, error: undefined }
      }
      case getType(actions.queryPhotos.success): {
        return { ...state, querying: false, error: undefined }
      }
      case getType(actions.queryPhotos.failure): {
        const { error } = action.payload
        const message = error.message as string || error as string || 'unknown error'
        return { ...state, querying: false, error: message }
      }
      case getType(actions.updateLastQueriedTime): {
        return { ...state, lastQueriedTime: action.payload.epochSeconds }
      }
      default:
        return state
    }
  },
  processingPhotos: (state = {}, action) => {
    switch (action.type) {
      case getType(actions.queryPhotos.success): {
        return action.payload
          .map((photo): ProcessingPhoto => ({ photo, state: 'preparing' }) )
          .reduce((accum, processingPhoto): ProcessingPhotos => ({ ...accum, [processingPhoto.photo.assetId]: processingPhoto }), state)
      }
      case getType(actions.photoPrepared): {
        const { id, preparedFiles } = action.payload
        const processingPhoto = state[id]
        const updated: ProcessingPhoto = { ...processingPhoto, state: 'adding', preparedFiles }
        return { ...state, [id]: updated }
      }
      case getType(actions.photoAdded): {
        const { id } = action.payload
        const processingPhoto = state[id]
        const updated: ProcessingPhoto = { ...processingPhoto, state: 'complete' }
        return { ...state, [id]: updated }
      }
      case getType(actions.photoCleanedUp): {
        const { id } = action.payload
        const { [id]: cleanedUp, ...rest } = state
        return rest
      }
      default:
        return state
    }
  }
})
