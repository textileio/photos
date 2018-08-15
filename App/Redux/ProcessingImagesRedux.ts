import { createAction, ActionType, getType } from 'typesafe-actions'
import { SharedImage, AddResult } from '../Models/TextileTypes'

const actions = {
  insertAddingImage: createAction('processingImages/INSERT_ADDING_IMAGE', resolve => {
    return (sharedImage: SharedImage, destinationThreadId: string, comment?: string) => resolve({ sharedImage, destinationThreadId, comment })
  }),
  imageAdded: createAction('processingImages/IMAGE_ADDED', resolve => {
    return (sharedImage: SharedImage, addResult: AddResult) => resolve({ sharedImage, addResult })
  }),
  imageUploadProgress: createAction('processingImages/IMAGE_UPLOAD_PROGRESS', resolve => {
    return (dataId: string, progress: number) => resolve({ dataId, progress })
  }),
  imageUploadComplete: createAction('processingImages/IMAGE_UPLOAD_COMPLETE', resolve => {
    return (dataId: string, responseCode: string, responseBody: string) => resolve({ dataId, responseCode, responseBody })
  }),
  imageUploadError: createAction('processingImages/IMAGE_UPLOAD_ERROR', resolve => {
    return (dataId: string, errorMessage: string) => resolve({ dataId, errorMessage })
  }),
  error: createAction('processingImages/ERROR', resolve => {
    return (sharedImage: SharedImage, error: any) => resolve({ sharedImage, error })
  })
}

export type ProcessingImagesAction = ActionType<typeof actions>

export type ProcessingImage = {
  readonly sharedImage: SharedImage
  readonly destinationThreadId: string
  readonly comment?: string
  readonly state: 'adding' | 'uploading' | 'addingToWallet' | 'sharing'
  readonly error?: string
  readonly addData?: {
    readonly addResult: AddResult
  }
  readonly uploadData?: {
    readonly uploadProgress: number
    readonly responseCode?: string
    readonly responseBody?: string
    readonly errorMessage?: string
  }
}

type ProcessingImagesMap = {
  readonly [key: string]: ProcessingImage
}

export type ProcessingImagesState = {
  readonly images: ProcessingImage[]
}

export const initialState: ProcessingImagesState = {
  images: []
}

export function reducer(state: ProcessingImagesState = initialState, action: ProcessingImagesAction): ProcessingImagesState {
  switch (action.type) {
    case getType(actions.insertAddingImage): {
      const processingImage: ProcessingImage = {
        ...action.payload,
        state: 'adding'
      }
      return { ...state, images: [...state.images, processingImage]}
    }
    case getType(actions.imageAdded): {
      const { sharedImage, addResult } = action.payload
      const images = state.images.map(image => {
        if (image.sharedImage === sharedImage ) {
          const processingImage: ProcessingImage = { ...image, addData: { addResult }, state: 'uploading' }
          return processingImage
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.imageUploadProgress): {
      const { dataId, progress } = action.payload
      const images = state.images.map(image => {
        if (!image.addData) {
          return image
        }
        if (image.addData.addResult.id === dataId) {
          const updated: ProcessingImage = { ...image, uploadData: { ...image.uploadData, uploadProgress: progress/100}}
          return updated
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.imageUploadComplete): {
      const { dataId, responseCode, responseBody } = action.payload
      const images = state.images.map(image => {
        if (!image.addData) {
          return image
        }
        if (image.addData.addResult.id === dataId) {
          const updated: ProcessingImage = { ...image, uploadData: { ...image.uploadData, uploadProgress: 1, responseCode, responseBody } }
          return updated
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.imageUploadError): {
      const { dataId, errorMessage } = action.payload
      const images = state.images.map(image => {
        if (!image.addData) {
          return image
        }
        if (image.addData.addResult.id === dataId) {
          const updated: ProcessingImage = { ...image, error: errorMessage }
          return updated
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.error): {
      const { sharedImage, error } = action.payload
      const e = (error.messags as string) || (error as string) || 'unknown'
      const images = state.images.map(image => {
        if (image.sharedImage === sharedImage ) {
          return { ...image, error: e }
        }
        return image
      })
      return { ...state, images }
    }
    default:
      return state
  }
}

export default actions
