import { createAction, ActionType, getType } from 'typesafe-actions'
import {ThreadId, SharedImage, AddResult, BlockId} from '../Models/TextileTypes'
import { RootState } from './Types'

const actions = {
  insertImage: createAction('processingImages/INSERT_IMAGE', (resolve) => {
    return (uuid: string, sharedImage: SharedImage, destinationThreadId?: ThreadId, comment?: string) => resolve({ uuid, sharedImage, destinationThreadId, comment })
  }),
  addingImage: createAction('processingImages/ADDING_IMAGE', (resolve) => {
    return (uuid: string) => resolve({ uuid })
  }),
  imageAdded: createAction('processingImages/IMAGE_ADDED', (resolve) => {
    return (uuid: string, addResult: AddResult) => resolve({ uuid, addResult })
  }),
  uploadStarted: createAction('processingImages/UPLOAD_STARTED', (resolve) => {
    return (uuid: string) => resolve({ uuid })
  }),
  imageUploadProgress: createAction('processingImages/IMAGE_UPLOAD_PROGRESS', (resolve) => {
    return (uuid: string, progress: number) => resolve({ uuid, progress })
  }),
  imageUploadComplete: createAction('processingImages/IMAGE_UPLOAD_COMPLETE', (resolve) => {
    return (uuid: string, responseCode: string, responseBody: string) => resolve({ uuid, responseCode, responseBody })
  }),
  addingToWallet: createAction('processingImages/ADDING_TO_WALLET', (resolve) => {
    return (uuid: string) => resolve({ uuid })
  }),
  addedToWallet: createAction('processingImages/ADDED_TO_WALLET', (resolve) => {
    return (uuid: string, blockId: BlockId) => resolve({ uuid, blockId })
  }),
  sharingToThread: createAction('processingImages/SHARING_TO_THREAD', (resolve) => {
    return (uuid: string) => resolve({ uuid })
  }),
  sharedToThread: createAction('processingImages/SHARED_TO_THREAD', (resolve) => {
    return (uuid: string, blockId: BlockId) => resolve({ uuid, blockId })
  }),
  complete: createAction('processingImages/COMPLETE', (resolve) => {
    return (uuid: string) => resolve({ uuid })
  }),
  retry: createAction('processingImages/RETRY', (resolve) => {
    return (uuid: string) => resolve({ uuid })
  }),
  cancelRequest: createAction('processingImages/CANCEL', (resolve) => {
    return (uuid: string) => resolve({ uuid })
  }),
  cancelComplete: createAction('processingImages/CANCEL_COMPLETE', (resolve) => {
    return (uuid: string) => resolve({ uuid })
  }),
  expiredTokenError: createAction('processingImages/EXPIRED_TOKEN', (resolve) => {
    return (uuid: string) => resolve({ uuid })
  }),
  error: createAction('processingImages/ERROR', (resolve) => {
    return (uuid: string, error: any) => resolve({ uuid, error })
  })
}

export type ProcessingImagesAction = ActionType<typeof actions>

export interface ProcessingImage {
  readonly uuid: string,
  readonly sharedImage: SharedImage
  readonly destinationThreadId?: ThreadId
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
    readonly blockId: BlockId
  }
  readonly shareToThreadData?: {
    readonly blockId: BlockId
  }
}

export interface ProcessingImagesState {
  readonly images: ProcessingImage[]
}

export const initialState: ProcessingImagesState = {
  images: []
}

export const ProcessingImagesSelectors = {
  processingImageByUuid: (state: RootState, uuid: string) => {
    const image = state.processingImages.images.find((image) => {
      return image.uuid === uuid
    })
    return image
  }
}

export function reducer (state: ProcessingImagesState = initialState, action: ProcessingImagesAction): ProcessingImagesState {
  switch (action.type) {
    case getType(actions.insertImage): {
      const processingImage: ProcessingImage = { ...action.payload, state: 'pending' }
      return { ...state, images: [...state.images, processingImage]}
    }
    case getType(actions.addingImage): {
      const { uuid } = action.payload
      const images = state.images.map((image) => {
        if (image.uuid === uuid) {
          const processingImage: ProcessingImage = { ...image, state: 'adding' }
          return processingImage
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.imageAdded): {
      const { uuid, addResult } = action.payload
      const images = state.images.map((image) => {
        if (image.uuid === uuid) {
          const processingImage: ProcessingImage = { ...image, addData: { addResult }, state: 'added' }
          return processingImage
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.uploadStarted): {
      const { uuid } = action.payload
      const images = state.images.map((image) => {
        if (image.uuid === uuid) {
          const processingImage: ProcessingImage = { ...image, uploadData: { uploadProgress: 0 }, state: 'uploading' }
          return processingImage
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.imageUploadProgress): {
      const { uuid, progress } = action.payload
      const images = state.images.map((image) => {
        if (image.uuid === uuid) {
          return { ...image, uploadData: { ...image.uploadData, uploadProgress: progress / 100}}
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.imageUploadComplete): {
      const { uuid, responseCode, responseBody } = action.payload
      const images = state.images.map((image) => {
        if (image.uuid === uuid) {
          const updated: ProcessingImage = { ...image, uploadData: { ...image.uploadData, uploadProgress: 1, responseCode, responseBody }, state: 'uploaded' }
          return updated
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.addingToWallet): {
      const { uuid } = action.payload
      const images = state.images.map((image) => {
        if (image.uuid === uuid) {
          const updated: ProcessingImage = { ...image, state: 'addingToWallet' }
          return updated
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.addedToWallet): {
      const { uuid, blockId } = action.payload
      const images = state.images.map((image) => {
        if (image.uuid === uuid) {
          const updated: ProcessingImage = { ...image, addToWalletData: { blockId }, state: 'addedToWallet' }
          return updated
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.sharingToThread): {
      const { uuid } = action.payload
      const images = state.images.map((image) => {
        if (image.uuid === uuid) {
          const updated: ProcessingImage = { ...image, state: 'sharing' }
          return updated
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.sharedToThread): {
      const { uuid, blockId } = action.payload
      const images = state.images.map((image) => {
        if (image.uuid === uuid) {
          const updated: ProcessingImage = { ...image, shareToThreadData: { blockId }, state: 'shared' }
          return updated
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.cancelComplete):
    case getType(actions.complete): {
      const { uuid } = action.payload
      const images = state.images.filter((image) => {
        return image.uuid !== uuid
      })
      return { ...state, images }
    }
    case getType(actions.retry): {
      const { uuid } = action.payload
      const images = state.images.map((image) => {
        if (image.uuid === uuid) {
          return { ...image, error: undefined }
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.error): {
      const { uuid, error } = action.payload
      const e = (error.message as string) || (error as string) || 'unknown'
      const images = state.images.map((image) => {
        if (image.uuid === uuid) {
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
