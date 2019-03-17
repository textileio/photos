
import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import { UploadData, ProcessingImage, Upload } from './models'
import * as actions from './actions'
import { allComplete } from './utils'

export interface ProcessingImagesState {
  readonly images: ReadonlyArray<ProcessingImage>
}

export type ProcessingImagesAction = ActionType<typeof actions>

export default combineReducers<ProcessingImagesState, ProcessingImagesAction>({
  images: (state = [], action: ProcessingImagesAction) => {
    switch (action.type) {
      case getType(actions.insertImage): {
        const processingImage: ProcessingImage = { ...action.payload, status: 'preparing' }
        return [...state, processingImage]
      }
      case getType(actions.imagePrepared): {
        const { uuid, preparedFiles } = action.payload
        const images = state.map((image) => {
          if (image.uuid === uuid) {
            const uploadData: UploadData = {}
            Object.keys(preparedFiles.pin).forEach((key) => {
              uploadData[key] = { id: key, path: preparedFiles.pin[key], status: 'pending', uploadProgress: 0 }
            })
            const processingImage: ProcessingImage = { ...image, preparedFiles, uploadData, status: 'uploading' }
            return processingImage
          }
          return image
        })
        return images
      }
      case getType(actions.uploadStarted): {
        const { uuid, uploadId } = action.payload
        const images = state.map((image) => {
          if (image.uuid === uuid) {
            const upload: Upload = { ...image.uploadData![uploadId], status: 'uploading' }
            const uploadData: UploadData = { ...image.uploadData, [uploadId]: upload }
            const processingImage: ProcessingImage = { ...image, uploadData }
            return processingImage
          }
          return image
        })
        return images
      }
      case getType(actions.imageUploadProgress): {
        const { uploadId, progress } = action.payload
        const images = state.map((image) => {
          if (image.uploadData && image.uploadData[uploadId]) {
            const upload: Upload = { ...image.uploadData![uploadId], uploadProgress: progress / 100 }
            const uploadData: UploadData = { ...image.uploadData, [uploadId]: upload }
            const processingImage: ProcessingImage = { ...image, uploadData }
            return processingImage
          }
          return image
        })
        return images
      }
      case getType(actions.imageUploadComplete): {
        const { uploadId, responseCode, responseBody } = action.payload
        const images = state.map((image) => {
          if (image.uploadData && image.uploadData[uploadId]) {
            const upload: Upload = { ...image.uploadData[uploadId], responseCode, responseBody, status: 'complete' }
            const uploadData: UploadData = { ...image.uploadData, [uploadId]: upload }
            const status = allComplete(uploadData) ? 'sharing' : image.status
            const processingImage: ProcessingImage = { ...image, uploadData, status }
            return processingImage
          }
          return image
        })
        return images
      }
      case getType(actions.sharedToThread): {
        const { uuid, block } = action.payload
        const images = state.map((image) => {
          if (image.uuid === uuid) {
            const updated: ProcessingImage = { ...image, block, status: 'complete' }
            return updated
          }
          return image
        })
        return images
      }
      case getType(actions.cancelComplete):
      case getType(actions.complete): {
        const { uuid } = action.payload
        const images = state.filter((image) => {
          return image.uuid !== uuid
        })
        return images
      }
      case getType(actions.retry): {
        const { uuid } = action.payload
        const images = state.map((image) => {
          if (image.uuid === uuid) {
            return { ...image, error: undefined }
          }
          return image
        })
        return images
      }
      case getType(actions.error): {
        const { error } = action.payload
        const e = (error.underlyingError.message as string) || (error.underlyingError as string) || 'unknown'
        const images = state.map((image) => {
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
        return images
      }
      default:
        return state
    }
  }
})
