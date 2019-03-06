import { ProcessingImagesState } from './reducer'
import { AddingPhotoItem } from './models'
import { allComplete } from './utils'

export function getProcessingImages(state: ProcessingImagesState, threadId: string): ReadonlyArray<AddingPhotoItem> {
  return state.images
    .filter((image) => image.destinationThreadId === threadId)
    .map((image) => {
      let progress = 0
      if (image.block) {
        progress = 1
      } else if (image.uploadData) {
        progress = 0.1 + (totalUploadProgress(state, image.uuid) * 0.8)
      } else if (image.preparedFiles) {
        progress = 0.1
      }
      const message = image.status
      const addingPhoto: AddingPhotoItem = {
        type: 'addingPhoto',
        key: image.uuid,
        data: {
          id: image.uuid,
          imageUri: image.sharedImage.origURL || image.sharedImage.uri,
          progress,
          message,
          errorMessage: image.error
        }
      }
      return addingPhoto
    })
}

export function totalUploadProgress(state: ProcessingImagesState, uuid: string) {
  const selector = processingImageByUuidFactory(uuid)
  const processingImage = selector(state)
  if (!processingImage || !processingImage.uploadData) {
    return 0
  }
  let numberUploads = 0
  let progress = 0
  for (const uploadId in processingImage.uploadData) {
    if (processingImage.uploadData[uploadId]) {
      numberUploads = numberUploads + 1
      progress = progress + processingImage.uploadData[uploadId].uploadProgress
    }
  }
  return progress / numberUploads
}

export function allUploadsComplete(state: ProcessingImagesState, uuid: string) {
  const selector = processingImageByUuidFactory(uuid)
  const processingImage = selector(state)
  if (!processingImage || !processingImage.uploadData) {
    return false
  }
  return allComplete(processingImage.uploadData)
}

export function processingImageByUuidFactory(uuid: string) {
  return (state: ProcessingImagesState) => state.images.find((image) => image.uuid === uuid)
}

export function processingImageForUploadId(state: ProcessingImagesState, uploadId: string) {
  return state.images.find((image) => {
    return image.uploadData !== undefined && image.uploadData[uploadId] !== undefined
  })
}

export function allUploadingImages(state: ProcessingImagesState) {
  return state.images.filter((image) => image.status === 'uploading')
}
