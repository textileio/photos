import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import { ProcessingImage } from './models'
import * as actions from './actions'

export interface ProcessingImagesState {
  readonly images: ReadonlyArray<ProcessingImage>
}

export type ProcessingImagesAction = ActionType<typeof actions>

export default combineReducers<ProcessingImagesState, ProcessingImagesAction>({
  images: (state = [], action: ProcessingImagesAction) => {
    switch (action.type) {
      case getType(actions.insertImage): {
        const processingImage: ProcessingImage = {
          ...action.payload,
          status: 'adding'
        }
        return [...state, processingImage]
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
        const { error } = action.payload
        const e =
          (error.underlyingError.message as string) ||
          (error.underlyingError as string) ||
          'unknown'
        const images = state.map(image => {
          if (image.uuid === error.uuid) {
            switch (error.type) {
              case 'general':
                return { ...image, error: e }
            }
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
