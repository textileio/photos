import { createAction, ActionType, getType } from 'typesafe-actions'
import { RootState } from './Types'
import { PhotoId } from '../Models/TextileTypes'

const actions = {
  addImage: createAction('ADD_IMAGE', (resolve) => {
    return (path: string, dataId: PhotoId, attempts: number) => resolve({ path, dataId, attempts })
  }),
  imageUploadProgress: createAction('IMAGE_UPLOAD_PROGRESS', (resolve) => {
    return (dataId: PhotoId, progress: number) => resolve({ dataId, progress })
  }),
  imageUploadComplete: createAction('IMAGE_UPLOAD_COMPLETE', (resolve) => {
    return (dataId: PhotoId, responseCode: string, responseBody: string) => resolve({ dataId, responseCode, responseBody })
  }),
  imageUploadError: createAction('IMAGE_UPLOAD_ERROR', (resolve) => {
    return (dataId: PhotoId, errorMessage: string) => resolve({ dataId, errorMessage })
  }),
  imageUploadRetried: createAction('IMAGE_UPLOAD_RETRIED', (resolve) => {
    return (dataId: PhotoId) => resolve({ dataId })
  }),
  imageRemovalComplete: createAction('IMAGE_REMOVAL_COMPLETE', (resolve) => {
    return (dataId: PhotoId) => resolve({ dataId })
  }),
  synchronizeNativeUploadsError: createAction('SYNCHRONIZE_NATIVE_UPLOADS_ERROR', (resolve) => {
    return (error: Error) => resolve(error)
  })
}

export type UploadingImagesAction = ActionType<typeof actions>

export interface UploadingImage {
  readonly path: string
  readonly dataId: PhotoId
  readonly state: 'pending' | 'uploading' | 'complete' | 'error'
  readonly uploadProgress: number
  readonly remainingUploadAttempts: number
  readonly responseCode?: string
  readonly responseBody?: string
  readonly errorMessage?: string
}

interface UploadingImagesMap {
  readonly [key: string]: UploadingImage
}

export interface UploadingImagesState {
  readonly images: UploadingImagesMap
}

export const initialState: UploadingImagesState = {
  images: {}
}

export const UploadingImagesSelectors = {
  uploadingImageById: (state: RootState, id: PhotoId) => state.uploadingImages.images[id],
  imagesForRetry: (state: RootState) => {
    return Object.keys(state.uploadingImages.images)
      .map((key) => state.uploadingImages.images[key])
      .filter((image) => image.state === 'error' && image.remainingUploadAttempts > 0)
  },
  uploadingImageIds: (state: RootState) => {
    const keys: PhotoId[] = []
    for (const key in state.uploadingImages.images) {
      if (state.uploadingImages.images.hasOwnProperty(key)) {
        const uploadingImage = state.uploadingImages.images[key]
        if (uploadingImage.state === 'uploading') {
          keys.push(uploadingImage.dataId)
        }
      }
    }
    return keys
  }
}

export function reducer (state: UploadingImagesState = initialState, action: UploadingImagesAction): UploadingImagesState {
  switch (action.type) {
    case getType(actions.addImage): {
      const { path, dataId, attempts } = action.payload
      return {
        ...state,
        images: {
          ...state.images,
          [dataId]: {
            path,
            dataId,
            state: 'pending',
            uploadProgress: 0,
            remainingUploadAttempts: attempts
          }
        }
      }
    }
    case getType(actions.imageUploadProgress): {
      const { dataId, progress } = action.payload
      const image = state.images[dataId]
      const updated: UploadingImage = { ...image, state: 'uploading', uploadProgress: progress / 100 }
      return { ...state, images: { ...state.images, [dataId]: updated } }
    }
    case getType(actions.imageUploadComplete): {
      const { dataId, responseCode, responseBody } = action.payload
      const image = state.images[dataId]
      const updated: UploadingImage = { ...image, state: 'complete', responseCode, responseBody }
      return { ...state, images: { ...state.images, [dataId]: updated } }
    }
    case getType(actions.imageUploadError): {
      const { dataId, errorMessage } = action.payload
      const image = state.images[dataId]
      const updated: UploadingImage = {
        ...image,
        state: 'error',
        errorMessage,
        remainingUploadAttempts: image.remainingUploadAttempts - 1
      }
      return { ...state, images: { ...state.images, [dataId]: updated } }
    }
    case getType(actions.imageUploadRetried): {
      const { dataId } = action.payload
      const image = state.images[dataId]
      const updated: UploadingImage = {
        ...image,
        state: 'pending',
        uploadProgress: 0,
        errorMessage: undefined
      }
      return { ...state, images: { ...state.images, [dataId]: updated } }
    }
    case getType(actions.imageRemovalComplete): {
      const { dataId } = action.payload
      const { [dataId as unknown as string]: removed, ...images } = state.images
      return { ...state, images }
    }
    default:
     return state
  }
}

export default actions
