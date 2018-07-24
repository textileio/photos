import { createAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  addImage: createAction('ADD_IMAGE', resolve => {
    return (path: string, dataId: string, attempts: number) => resolve({ path, dataId, attempts })
  }),
  imageUploadProgress: createAction('IMAGE_UPLOAD_PROGRESS', resolve => {
    return (dataId: string, progress: number) => resolve({ dataId, progress })
  }),
  imageUploadComplete: createAction('IMAGE_UPLOAD_COMPLETE', resolve => {
    return (dataId: string) => resolve({ dataId })
  }),
  imageUploadError: createAction('IMAGE_UPLOAD_ERROR', resolve => {
    return (dataId: string, error: Error) => resolve({ dataId, error })
  }),
  imageUploadRetried: createAction('IMAGE_UPLOAD_RETRIED', resolve => {
    return (dataId: string) => resolve({ dataId })
  })
}

export type UploadingImagesAction = ActionType<typeof actions>

export type UploadingImage = {
  readonly path: string
  readonly dataId: string
  readonly state: 'pending' | 'uploading'
  readonly uploadProgress: number
  readonly remainingUploadAttempts: number
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
      const updated: UploadingImage = { ...image, state: 'uploading', uploadProgress: progress }
      return { ...state, images: { ...state.images, [dataId]: updated } }
    }
    case getType(actions.imageUploadComplete): {
      const { dataId } = action.payload
      const { [dataId]: removed, ...images } = state.images
      return { ...state, images }
    }
    case getType(actions.imageUploadError): {
      const { dataId, error } = action.payload
      const image = state.images[dataId]
      const updated: UploadingImage = {
        ...image,
        errorMessage: error.message,
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
    default:
     return state
  }
}

export default actions
