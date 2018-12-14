import { RootState } from './Types'
import { selectors } from './ProcessingImagesRedux'

export function processingImageByUuid(state: RootState, uuid: string) {
  return selectors.processingImageByUuid(state.processingImages, uuid)
}

export function processingImageForUploadId(state: RootState, uploadId: string) {
  return state.processingImages.images.find((image) => {
    return image.uploadData !== undefined && image.uploadData[uploadId] !== undefined
  })
}

export function allUploadingImages(state: RootState) {
  return state.processingImages.images.filter((image) => image.status === 'uploading')
}

export function allUploadsComplete(state: RootState, uuid: string) {
  return selectors.allUploadsComplete(state.processingImages, uuid)
}

export function totalUploadProgress(state: RootState, uuid: string) {
  const processingImage = processingImageByUuid(state, uuid)
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
