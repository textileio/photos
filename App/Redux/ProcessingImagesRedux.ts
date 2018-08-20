import { createAction, ActionType, getType } from 'typesafe-actions'
import { SharedImage, AddResult } from '../Models/TextileTypes'
import { RootState } from './Types'

const actions = {
  insertImage: createAction('processingImages/INSERT_IMAGE', resolve => {
    return (sharedImage: SharedImage, destinationThreadId: string, comment?: string) => resolve({ sharedImage, destinationThreadId, comment })
  }),
  addingImage: createAction('processingImages/ADDING_IMAGE', resolve => {
    return (sharedImage: SharedImage) => resolve({ sharedImage })
  }),
  imageAdded: createAction('processingImages/IMAGE_ADDED', resolve => {
    return (sharedImage: SharedImage, addResult: AddResult) => resolve({ sharedImage, addResult })
  }),
  addingError: createAction('processingImages/ADDING_ERROR', resolve => {
    return (sharedImage: SharedImage, error: any) => resolve({ sharedImage, error })
  }),
  uploadStarted: createAction('processingImages/UPLOAD_STARTED', resolve => {
    return (dataId: string) => resolve({ dataId })
  }),
  imageUploadProgress: createAction('processingImages/IMAGE_UPLOAD_PROGRESS', resolve => {
    return (dataId: string, progress: number) => resolve({ dataId, progress })
  }),
  imageUploadComplete: createAction('processingImages/IMAGE_UPLOAD_COMPLETE', resolve => {
    return (dataId: string, responseCode: string, responseBody: string) => resolve({ dataId, responseCode, responseBody })
  }),
  addingToWallet: createAction('processingImages/ADDING_TO_WALLET', resolve => {
    return (dataId: string) => resolve({ dataId })
  }),
  addedToWallet: createAction('processingImages/ADDED_TO_WALLET', resolve => {
    return (dataId: string, blockId: string) => resolve({ dataId, blockId })
  }),
  sharingToThread: createAction('processingImages/SHARING_TO_THREAD', resolve => {
    return (dataId: string) => resolve({ dataId })
  }),
  sharedToThread: createAction('processingImages/SHARED_TO_THREAD', resolve => {
    return (dataId: string, blockId: string) => resolve({ dataId, blockId })
  }),
  complete: createAction('processingImages/COMPLETE', resolve => {
    return (dataId: string) => resolve({ dataId })
  }),
  retry: createAction('processingImages/RETRY', resolve => {
    return (dataId: string) => resolve({ dataId })
  }),
  cancelRequest: createAction('processingImages/CANCEL', resolve => {
    return (dataId: string) => resolve({ dataId })
  }),
  cancelComplete: createAction('processingImages/CANCEL_COMPLETE', resolve => {
    return (dataId: string) => resolve({ dataId })
  }),
  error: createAction('processingImages/ERROR', resolve => {
    return (dataId: string, error: any) => resolve({ dataId, error })
  }),
}

export type ProcessingImagesAction = ActionType<typeof actions>

export type ProcessingImage = {
  readonly sharedImage: SharedImage
  readonly destinationThreadId: string
  readonly comment?: string
  readonly state: 'pending' | 'adding' | 'added' | 'uploading' | 'uploaded' | 'addingToWallet' | 'addedToWallet' | 'sharing' | 'shared'
  readonly error?: string
  readonly addData?: {
    readonly addResult: AddResult
  }
  readonly uploadData?: {
    readonly uploadProgress: number
    readonly responseCode?: string
    readonly responseBody?: string
  }
  readonly addToWalletData?: {
    readonly blockId: string
  }
  readonly shareToThreadData?: {
    readonly blockId: string
  }
}

export type ProcessingImagesState = {
  readonly images: ProcessingImage[]
}

export const initialState: ProcessingImagesState = {
  images: []
}

export const ProcessingImagesSelectors = {
  processingImageByAddResultId: (state: RootState, id: string) => {
    const image = state.processingImages.images.find(image => {
      if (!image.addData) {
        return false
      }
      return image.addData.addResult.id === id
    })
    return image
  }
}

export function reducer(state: ProcessingImagesState = initialState, action: ProcessingImagesAction): ProcessingImagesState {
  switch (action.type) {
    case getType(actions.insertImage): {
      const processingImage: ProcessingImage = { ...action.payload, state: 'pending' }
      return { ...state, images: [...state.images, processingImage]}
    }
    case getType(actions.addingImage): {
      const { sharedImage } = action.payload
      const images = state.images.map(image => {
        if (image.sharedImage === sharedImage) {
          const processingImage: ProcessingImage = { ...image, state: 'adding' }
          return processingImage
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.imageAdded): {
      const { sharedImage, addResult } = action.payload
      const images = state.images.map(image => {
        if (image.sharedImage === sharedImage) {
          const processingImage: ProcessingImage = { ...image, addData: { addResult }, state: 'added' }
          return processingImage
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.addingError): {
      const { sharedImage, error } = action.payload
      const e = (error.message as string) || (error as string) || 'unknown'
      const images = state.images.map(image => {
        if (image.sharedImage === sharedImage) {
          return { ...image, error: e }
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.uploadStarted): {
      const { dataId } = action.payload
      const images = state.images.map(image => {
        if (!image.addData) {
          return image
        }
        if (image.addData.addResult.id === dataId) {
          const processingImage: ProcessingImage = { ...image, uploadData: { uploadProgress: 0 }, state: 'uploading' }
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
          const updated: ProcessingImage = { ...image, uploadData: { ...image.uploadData, uploadProgress: 1, responseCode, responseBody }, state: 'uploaded' }
          return updated
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.addingToWallet): {
      const { dataId } = action.payload
      const images = state.images.map(image => {
        if (!image.addData) {
          return image
        }
        if (image.addData.addResult.id === dataId) {
          const updated: ProcessingImage = { ...image, state: 'addingToWallet' }
          return updated
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.addedToWallet): {
      const { dataId, blockId } = action.payload
      const images = state.images.map(image => {
        if (!image.addData) {
          return image
        }
        if (image.addData.addResult.id === dataId) {
          const updated: ProcessingImage = { ...image, addToWalletData: { blockId }, state: 'addedToWallet' }
          return updated
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.sharingToThread): {
      const { dataId } = action.payload
      const images = state.images.map(image => {
        if (!image.addData) {
          return image
        }
        if (image.addData.addResult.id === dataId) {
          const updated: ProcessingImage = { ...image, state: 'sharing' }
          return updated
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.sharedToThread): {
      const { dataId, blockId } = action.payload
      const images = state.images.map(image => {
        if (!image.addData) {
          return image
        }
        if (image.addData.addResult.id === dataId) {
          const updated: ProcessingImage = { ...image, shareToThreadData: { blockId }, state: 'shared' }
          return updated
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.cancelComplete):
    case getType(actions.complete): {
      const { dataId } = action.payload
      const images = state.images.filter(image => {
        if (!image.addData) {
          return true
        }
        return image.addData.addResult.id !== dataId
      })
      return { ...state, images }
    }
    case getType(actions.retry): {
      const { dataId } = action.payload
      const images = state.images.map(image => {
        if (!image.addData) {
          return image
        }
        if (image.addData.addResult.id === dataId) {
          return { ...image, error: undefined }
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.error): {
      const { dataId, error } = action.payload
      const e = (error.message as string) || (error as string) || 'unknown'
      const images = state.images.map(image => {
        if (!image.addData) {
          return image
        }
        if (image.addData.addResult.id === dataId) {
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
