import { createAction, ActionType, getType } from 'typesafe-actions'
import { SharedImage, AddResult } from '../Models/TextileTypes'

const actions = {
  insertAddingImage: createAction('processingImages/insertAddingImage', resolve => {
    return (sharedImage: SharedImage, destinationThreadId: string, comment?: string) => resolve({ sharedImage, destinationThreadId, comment })
  }),
  imageAdded: createAction('processingImages/imageAdded', resolve => {
    return (sharedImage: SharedImage, addResult: AddResult) => resolve({ sharedImage, addResult })
  }),
  error: createAction('processingImages/error', resolve => {
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
  }
}

export default actions
