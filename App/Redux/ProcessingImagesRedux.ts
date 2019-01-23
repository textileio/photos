import { createAction, ActionType, getType } from 'typesafe-actions'
import { SharedImage } from '../Models/TextileTypes'
import { BlockInfo, Protobufs } from '@textile/react-native-sdk'

const actions = {
  insertImage: createAction('processingImages/INSERT_IMAGE', (resolve) => {
    return (uuid: string, sharedImage: SharedImage, destinationThreadId: string, comment?: string) => resolve({ uuid, sharedImage, destinationThreadId, comment })
  }),
  imagePrepared: createAction('processingImages/IMAGE_PREPARED', (resolve) => {
    return (uuid: string, preparedFiles: Protobufs.IMobilePreparedFiles) => resolve({ uuid, preparedFiles })
  }),
  uploadStarted: createAction('processingImages/UPLOAD_STARTED', (resolve) => {
    return (uuid: string, uploadId: string) => resolve({ uuid, uploadId })
  }),
  imageUploadProgress: createAction('processingImages/IMAGE_UPLOAD_PROGRESS', (resolve) => {
    return (uploadId: string, progress: number) => resolve({ uploadId, progress })
  }),
  imageUploadComplete: createAction('processingImages/IMAGE_UPLOAD_COMPLETE', (resolve) => {
    return (uploadId: string, responseCode: string, responseBody: string) => resolve({ uploadId, responseCode, responseBody })
  }),
  sharedToThread: createAction('processingImages/SHARED_TO_THREAD', (resolve) => {
    return (uuid: string, blockInfo: BlockInfo) => resolve({ uuid, blockInfo })
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
  error: createAction('processingImages/ERROR', (resolve) => {
    return (error: ProcessingImageError) => resolve({ error })
  })
}

export type ProcessingImagesAction = ActionType<typeof actions>

interface GeneralError {
  uuid: string
  underlyingError: any
  type: 'general'
}

interface ExpiredTokenError {
  uuid: string
  uploadId: string
  underlyingError: 'expired token'
  type: 'expiredToken'
}

interface UploadError {
  uuid: string
  uploadId: string
  underlyingError: any
  type: 'upload'
}

type ProcessingImageError = GeneralError | ExpiredTokenError | UploadError

interface Upload {
  readonly id: string
  readonly path: string
  readonly status: 'pending' | 'uploading' | 'complete' | 'error'
  readonly uploadProgress: number
  readonly responseCode?: string
  readonly responseBody?: string
  readonly error?: string
}
interface UploadData {
  [key: string]: Upload
}

export interface ProcessingImage {
  readonly uuid: string,
  readonly sharedImage: SharedImage
  readonly status: 'preparing'  | 'uploading' | 'sharing' | 'complete'
  readonly destinationThreadId: string
  readonly comment?: string
  readonly preparedFiles?: Protobufs.IMobilePreparedFiles
  readonly uploadData?: UploadData
  readonly blockInfo?: BlockInfo
  readonly error?: string
}

export interface ProcessingImagesState {
  readonly images: ReadonlyArray<ProcessingImage>
}

export const initialState: ProcessingImagesState = {
  images: []
}

export const selectors = {
  allUploadsComplete: (state: ProcessingImagesState, uuid: string) => {
    const processingImage = selectors.processingImageByUuid(state, uuid)
    if (!processingImage || !processingImage.uploadData) {
      return false
    }
    if (Object.keys(processingImage.uploadData).length < 1) {
      return false
    }
    let allUploadsComplete = true
    for (const id in processingImage.uploadData) {
      if (processingImage.uploadData[id]) {
        if (processingImage.uploadData[id].status !== 'complete') {
          allUploadsComplete = false
        }
      }
    }
    return allUploadsComplete
  },
  processingImageByUuid: (state: ProcessingImagesState, uuid: string) => state.images.find((image) => image.uuid === uuid)
}

export function reducer (state: ProcessingImagesState = initialState, action: ProcessingImagesAction): ProcessingImagesState {
  switch (action.type) {
    case getType(actions.insertImage): {
      const processingImage: ProcessingImage = { ...action.payload, status: 'preparing' }
      return { ...state, images: [...state.images, processingImage]}
    }
    case getType(actions.imagePrepared): {
      const { uuid, preparedFiles } = action.payload
      const images = state.images.map((image) => {
        if (image.uuid === uuid) {
          const uploadData: UploadData = {}
          if (preparedFiles.pin) {
            for (const id in preparedFiles.pin) {
              if (preparedFiles.pin[id]) {
                uploadData[id] = { id, path: preparedFiles.pin[id], status: 'pending', uploadProgress: 0 }
              }
            }
          }
          const processingImage: ProcessingImage = { ...image, preparedFiles, uploadData, status: 'uploading' }
          return processingImage
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.uploadStarted): {
      const { uuid, uploadId } = action.payload
      const images = state.images.map((image) => {
        if (image.uuid === uuid) {
          const upload: Upload = { ...image.uploadData![uploadId], status: 'uploading' }
          const uploadData: UploadData = { ...image.uploadData, [uploadId]: upload }
          const processingImage: ProcessingImage = { ...image, uploadData }
          return processingImage
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.imageUploadProgress): {
      const { uploadId, progress } = action.payload
      const images = state.images.map((image) => {
        if (image.uploadData && image.uploadData[uploadId]) {
          const upload: Upload = { ...image.uploadData![uploadId], uploadProgress: progress / 100 }
          const uploadData: UploadData = { ...image.uploadData, [uploadId]: upload }
          const processingImage: ProcessingImage = { ...image, uploadData }
          return processingImage
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.imageUploadComplete): {
      const { uploadId, responseCode, responseBody } = action.payload
      const images = state.images.map((image) => {
        if (image.uploadData && image.uploadData[uploadId]) {
          const upload: Upload = { ...image.uploadData[uploadId], responseCode, responseBody, status: 'complete' }
          const uploadData: UploadData = { ...image.uploadData, [uploadId]: upload }
          const allUploadsComplete = selectors.allUploadsComplete(state, image.uuid)
          const status = allUploadsComplete ? 'sharing' : image.status
          const processingImage: ProcessingImage = { ...image, uploadData, status }
          return processingImage
        }
        return image
      })
      return { ...state, images }
    }
    case getType(actions.sharedToThread): {
      const { uuid, blockInfo } = action.payload
      const images = state.images.map((image) => {
        if (image.uuid === uuid) {
          const updated: ProcessingImage = { ...image, blockInfo, status: 'complete' }
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
      const { error } = action.payload
      const e = (error.underlyingError.message as string) || (error.underlyingError as string) || 'unknown'
      const images = state.images.map((image) => {
        if (image.uuid === error.uuid) {
          switch (error.type) {
            case 'general':
              return { ...image, error: e }
            case 'expiredToken':
            case 'upload':
              const { uploadId } = error
              if (image.uploadData && image.uploadData[uploadId]) {
                const upload: Upload = { ...image.uploadData[uploadId], error: e, status: 'error' }
                const uploadData: UploadData = { ...image.uploadData, [uploadId]: upload }
                // Don't set the ProcessingImage.error if it's an expired token error because
                // that is expected and handled by automatic retry
                const errorMessage = error.type === 'expiredToken' ? image.error : e
                const processingImage: ProcessingImage = { ...image, uploadData, error: errorMessage }
                return processingImage
              } else {
                return { ...image, error: e } // TODO: and here?
              }
          }
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
