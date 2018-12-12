import { createAction, ActionType, getType } from 'typesafe-actions'
import { SharedImage } from '../Models/TextileTypes'
import { IMobilePreparedFiles } from '../NativeModules/Textile/pb/textile-go'
import { BlockInfo } from '../NativeModules/Textile'

const actions = {
  insertImage: createAction('processingImages/INSERT_IMAGE', (resolve) => {
    return (uuid: string, sharedImage: SharedImage, destinationThreadId: string, comment?: string) => resolve({ uuid, sharedImage, destinationThreadId, comment })
  }),
  imagePrepared: createAction('processingImages/IMAGE_PREPARED', (resolve) => {
    return (uuid: string, preparedFiles: IMobilePreparedFiles) => resolve({ uuid, preparedFiles })
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
  expiredTokenError: createAction('processingImages/EXPIRED_TOKEN', (resolve) => {
    return (uploadId: string) => resolve({ uploadId })
  }),
  error: createAction('processingImages/ERROR', (resolve) => {
    return (uuid: string, error: any) => resolve({ uuid, error })
  }),
  uploadError: createAction('processingImages/UPLOAD_ERROR', (resolve) => {
    return (uploadId: string, error: any) => resolve({ uploadId, error })
  })
}

export type ProcessingImagesAction = ActionType<typeof actions>

interface Upload {
  readonly id: string
  readonly path: string
  readonly status: 'pending' | 'uploading' | 'complete'
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
  readonly preparedFiles?: IMobilePreparedFiles
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
    case getType(actions.uploadError): {
      const { uploadId, error } = action.payload
      const e = (error.message as string) || (error as string) || 'unknown'
      const images = state.images.map((image) => {
        if (image.uploadData && image.uploadData[uploadId]) {
          const upload: Upload = { ...image.uploadData![uploadId], error: e }
          const uploadData: UploadData = { ...image.uploadData, [uploadId]: upload }
          const processingImage: ProcessingImage = { ...image, uploadData }
          return processingImage
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
