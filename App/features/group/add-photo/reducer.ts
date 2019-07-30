import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import { ProcessingImage } from './models'
import * as actions from './actions'

export interface ProcessingImagesState {
  readonly queryData: {
    readonly lastQueriedTime?: number
    readonly querying: boolean
    readonly error?: string
  }
  readonly images: ReadonlyArray<ProcessingImage>
}

export type ProcessingImagesAction = ActionType<typeof actions>

export default combineReducers<ProcessingImagesState, ProcessingImagesAction>({
  queryData: (state = { querying: false }, action) => {
    switch (action.type) {
      case getType(actions.queryCameraRoll.request): {
        return { ...state, querying: true, error: undefined }
      }
      case getType(actions.queryCameraRoll.success): {
        return { ...state, querying: false, error: undefined }
      }
      case getType(actions.queryCameraRoll.failure): {
        const { error } = action.payload
        const message =
          (error.message as string) || (error as string) || 'unknown error'
        return { ...state, querying: false, error: message }
      }
      case getType(actions.updateLastQueriedTime): {
        return { ...state, lastQueriedTime: action.payload.epochSeconds }
      }
      default:
        return state
    }
  },
  images: (state = [], action: ProcessingImagesAction) => {
    switch (action.type) {
      case getType(actions.queryCameraRoll.success): {
        const newItems = action.payload.map(
          (sharedImage): ProcessingImage => {
            return {
              ...sharedImage,
              status: 'pending'
            }
          }
        )
        return [...state, ...newItems]
      }
      case getType(actions.insertPhoto): {
        const processingImage: ProcessingImage = {
          ...action.payload.payload,
          status: 'pending'
        }
        return [...state, processingImage]
      }
      case getType(actions.photoProcessingBegan): {
        const { uuid } = action.payload
        const images = state.map(image => {
          if (image.uuid === uuid) {
            const updated: ProcessingImage = {
              ...image,
              status: 'adding'
            }
            return updated
          }
          return image
        })
        return images
      }
      case getType(actions.addedToThread): {
        const { uuid, block } = action.payload
        const images = state.map(image => {
          if (image.uuid === uuid) {
            const updated: ProcessingImage = {
              ...image,
              block,
              status: 'complete'
            }
            return updated
          }
          return image
        })
        return images
      }
      case getType(actions.cancelComplete):
      case getType(actions.complete): {
        const { uuid } = action.payload
        const images = state.filter(image => {
          return image.uuid !== uuid
        })
        return images
      }
      case getType(actions.retry): {
        const { uuid } = action.payload
        const images = state.map(image => {
          if (image.uuid === uuid) {
            return { ...image, error: undefined }
          }
          return image
        })
        return images
      }
      case getType(actions.error): {
        const { uuid, error } = action.payload
        const message =
          (error.message as string) || (error as string) || 'unknown error'
        const images = state.map(image => {
          if (image.uuid === uuid) {
            return { ...image, error: message }
          }
          return image
        })
        return images
      }
      default:
        return state
    }
  }
})
