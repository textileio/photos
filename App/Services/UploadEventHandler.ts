import { Store } from 'redux'
// TODO: Create typings
import Upload from 'react-native-background-upload'

import { RootState } from '../Redux/Types'

import UploadingImagesActions from '../Redux/UploadingImagesRedux'

export default class UploadEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  uploadProgress (e: any) {
    this.store.dispatch(UploadingImagesActions.imageUploadProgress(e.id, e.progress))
  }

  uploadComplete (e: any) {
    const { responseCode } = e
    if (responseCode >= 200 && responseCode < 300) {
      this.store.dispatch(UploadingImagesActions.imageUploadComplete(e.id, e.responseCode, e.responseBody))
    } else {
      this.store.dispatch(UploadingImagesActions.imageUploadError(e.id, 'Response code: ' + responseCode))
    }
  }

  uploadCancelled (e: any) {
    this.store.dispatch(UploadingImagesActions.imageUploadError(e.id, 'Cancelled'))
  }

  uploadError (e: any) {
    this.store.dispatch(UploadingImagesActions.imageUploadError(e.id, e.error))
  }

  setup () {
    Upload.addListener('progress', null, this.uploadProgress.bind(this))
    Upload.addListener('completed', null, this.uploadComplete.bind(this))
    Upload.addListener('cancelled', null, this.uploadCancelled.bind(this))
    Upload.addListener('error', null, this.uploadError.bind(this))
  }

  tearDown () {
    // TODO: Do we need to unsubscribe?
  }
}