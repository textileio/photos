import { Store } from 'redux'
// TODO: Create typings
// @ts-ignore
import Upload from 'react-native-background-upload'

import { RootState } from '../../Redux/Types'

import ProcessingImagesActions from '../../Redux/ProcessingImagesRedux'

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
      this.store.dispatch(ProcessingImagesActions.expiredTokenError(e.id))
    } else {
      this.store.dispatch(ProcessingImagesActions.error(e.id, `Response code: ${responseCode}`))
    }
  }

  uploadCancelled (e: any) {
    this.store.dispatch(ProcessingImagesActions.error(e.id, 'Cancelled'))
  }

  uploadError (e: any) {
    this.store.dispatch(ProcessingImagesActions.error(e.id, e.error))
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
