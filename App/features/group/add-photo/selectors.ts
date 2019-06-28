import { ProcessingImagesState } from './reducer'
import { AddingPhotoItem } from './models'

export function processingImageByUuidFactory(uuid: string) {
  return (state: ProcessingImagesState) =>
    state.images.find(image => image.uuid === uuid)
}

export function getProcessingImages(
  state: ProcessingImagesState,
  threadId: string
): ReadonlyArray<AddingPhotoItem> {
  return state.images
    .filter(image => image.destinationThreadId === threadId)
    .map(image => {
      const message = image.status
      const addingPhoto: AddingPhotoItem = {
        type: 'addingPhoto',
        key: image.uuid,
        data: {
          id: image.uuid,
          imageUri: image.sharedImage.origURL || image.sharedImage.uri,
          message,
          errorMessage: image.error
        }
      }
      return addingPhoto
    })
}
