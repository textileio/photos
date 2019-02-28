import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import * as actions from './actions'

export interface PhotosState {
  readonly queryData: {
    readonly lastQueriedTime?: number
    readonly querying: boolean
    readonly error?: string
  }
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
  }
})
