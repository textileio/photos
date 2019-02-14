import { Store } from 'redux'
import Upload from 'react-native-background-upload'

import { RootState } from '../../Redux/Types'

import ProcessingImagesActions from '../../Redux/ProcessingImagesRedux'
import { processingImageForUploadId } from '../../Redux/ProcessingImagesSelectors'

export default class UploadEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  uploadProgress (e: any) {
    this.store.dispatch(ProcessingImagesActions.imageUploadProgress(e.id, e.progress))
  }

  uploadComplete (e: any) {
    const { responseCode } = e
    if (responseCode >= 200 && responseCode < 300) {
      this.store.dispatch(ProcessingImagesActions.imageUploadComplete(e.id, e.responseCode, e.responseBody))
    } else if (responseCode === 401) {
      const processingImage = processingImageForUploadId(this.store.getState(), e.id)
      if (processingImage) {
        this.store.dispatch(ProcessingImagesActions.error({
          uuid: processingImage.uuid,
          uploadId: e.id,
          underlyingError: 'expired token',
          type: 'expiredToken'
        }))
      }
    } else {
      const processingImage = processingImageForUploadId(this.store.getState(), e.id)
      if (processingImage) {
        this.store.dispatch(ProcessingImagesActions.error({
          uuid: processingImage.uuid,
          uploadId: e.id,
          underlyingError: `Response code: ${responseCode}`,
          type: 'upload'
        }))
      }
    }
  }

  uploadCancelled (e: any) {
    const processingImage = processingImageForUploadId(this.store.getState(), e.id)
    if (processingImage) {
      this.store.dispatch(ProcessingImagesActions.error({
        uuid: processingImage.uuid,
        uploadId: e.id,
        underlyingError: 'Cancelled',
        type: 'upload'
      }))
    }
  }

  uploadError (e: any) {
    const processingImage = processingImageForUploadId(this.store.getState(), e.id)
    if (processingImage) {
      this.store.dispatch(ProcessingImagesActions.error({
        uuid: processingImage.uuid,
        uploadId: e.id,
        underlyingError: e.error,
        type: 'upload'
      }))
    }
  }

  setup () {
    Upload.addListener('progress', undefined, this.uploadProgress.bind(this))
    Upload.addListener('completed', undefined, this.uploadComplete.bind(this))
    Upload.addListener('cancelled', undefined, this.uploadCancelled.bind(this))
    Upload.addListener('error', undefined, this.uploadError.bind(this))
  }

  tearDown () {
    // TODO: Do we need to unsubscribe?
  }
}
