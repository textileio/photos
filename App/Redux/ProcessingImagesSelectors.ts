import { RootState } from './Types'
import { selectors } from './ProcessingImagesRedux'
import { FeedPhoto, getThreads } from './PhotoViewingSelectors'
import Config from 'react-native-config'

export function getProcessingImages(state: RootState, threadId?: string): ReadonlyArray<FeedPhoto> {
  // Filters out uplaods happening on non-UI threads (avatars etc), and filter out everything except threadId if provided
  const threadIds = getThreads(state)
    .filter((thread) => threadId ? thread.id === threadId : true)
    .map((thread) => thread.id)
  return state.processingImages.images
    .filter((image) => threadIds.indexOf(image.destinationThreadId) >= 0)
    .map((image) => {
      let progress = 0
      if (image.blockInfo) {
        progress = 1
      } else if (image.uploadData) {
        progress = 0.1 + (totalUploadProgress(state, image.uuid) * 0.8)
      } else if (image.preparedFiles) {
        progress = 0.1
      }
      const message = image.status
      return {
        type: 'processingItem',
        block: image.uuid,
        props: {
          imageUri: image.sharedImage.origURL || image.sharedImage.uri, // TODO: Check this on Android
          progress,
          message,
          errorMessage: image.error
        }
      } as FeedPhoto
    })
}

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
