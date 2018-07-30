import { createAction, ActionType, getType } from 'typesafe-actions'
import { read } from 'fs';

const actions = {
  addImage: createAction('ADD_IMAGE', resolve => {
    return (path: string, dataId: string, attempts: number) => resolve({ path, dataId, attempts })
  }),
  imageUploadProgress: createAction('IMAGE_UPLOAD_PROGRESS', resolve => {
    return (dataId: string, progress: number) => resolve({ dataId, progress })
  }),
  imageUploadComplete: createAction('IMAGE_UPLOAD_COMPLETE', resolve => {
    return (dataId: string, responseCode: string, responseBody: string) => resolve({ dataId, responseCode, responseBody })
  }),
  imageUploadError: createAction('IMAGE_UPLOAD_ERROR', resolve => {
    return (dataId: string, errorMessage: string) => resolve({ dataId, errorMessage })
  }),
  imageUploadRetried: createAction('IMAGE_UPLOAD_RETRIED', resolve => {
    return (dataId: string) => resolve({ dataId })
  }),
  imageRemovalComplete: createAction('IMAGE_REMOVAL_COMPLETE', resolve => {
    return (dataId: string) => resolve({ dataId })
  }),
  synchronizeNativeUploadsError: createAction('SYNCHRONIZE_NATIVE_UPLOADS_ERROR', resolve => {
    return (error: Error) => resolve(error)
  }),
}

export type UploadingImagesAction = ActionType<typeof actions>

export type UploadingImage = {
  readonly path: string
  readonly dataId: string
  readonly state: 'pending' | 'uploading' | 'complete' | 'error'
  readonly uploadProgress: number
  readonly remainingUploadAttempts: number
  readonly responseCode?: string
  readonly responseBody?: string
  readonly errorMessage?: string
}

type UploadingImagesMap = {
  readonly [key: string]: UploadingImage
}

export type UploadingImagesState = {
  readonly images: UploadingImagesMap
}

export const initialState: UploadingImagesState = {
  images: {}
}

export const UploadingImagesSelectors = {
  uploadingImageById: (state, id) => state.uploadingImages.images[id] as UploadingImage,
  imagesForRetry: (state) => {
    return Object.keys(state.uploadingImages.images)
      .map(key => state.uploadingImages.images[key])
      .filter(image => image.state === 'error' && image.remainingUploadAttempts > 0) as UploadingImage[]
  },
  pendingImages: (state) => {
    let keys: string[] = []
    for (let key in state.uploadingImages.images) {
      if (state.uploadingImages.images.hasOwnProperty(key) && state.uploadingImages.images[key].state === 'pending') {
        keys.push(key)
      }
    }
    return keys
  },
  uploadingImageIds: (state) => {
    let keys: string[] = []
    for (let key in state.uploadingImages.images) {
      if (state.uploadingImages.images.hasOwnProperty(key) && state.uploadingImages.images[key].state === 'uploading') {
        keys.push(key)
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
      const updated: UploadingImage = { ...image, state: 'uploading', uploadProgress: progress/100 }
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
      const { [dataId]: removed, ...images } = state.images
      return { ...state, images }
    }
    default:
     return state
  }
}

export default actions
