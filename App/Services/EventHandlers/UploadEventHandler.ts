import { Store } from 'redux'
import Upload from 'react-native-background-upload'

import { RootState } from '../../Redux/Types'
import { groupActions, groupSelectors } from '../../features/group'
import { fileSyncActions } from '../../features/file-sync'

export default class UploadEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  uploadProgress(e: any) {
    this.store.dispatch(
      groupActions.addPhoto.imageUploadProgress(e.id, e.progress)
    )
    this.store.dispatch(fileSyncActions.uploadProgress(e.id, e.progress))
  }

  uploadComplete(e: any) {
    const { responseCode } = e
    if (responseCode >= 200 && responseCode < 300) {
      this.store.dispatch(
        groupActions.addPhoto.imageUploadComplete(
          e.id,
          e.responseCode,
          e.responseBody
        )
      )
      this.store.dispatch(
        fileSyncActions.uploadComplete(e.id, e.responseCode, e.responseBody)
      )
    } else if (responseCode === 401) {
      const processingImage = groupSelectors.addPhotoSelectors.processingImageForUploadId(
        this.store.getState().group.addPhoto,
        e.id
      )
      if (processingImage) {
        this.store.dispatch(
          groupActions.addPhoto.error({
            uuid: processingImage.uuid,
            uploadId: e.id,
            underlyingError: 'expired token',
            type: 'expiredToken'
          })
        )
      }
      this.store.dispatch(fileSyncActions.error(e.id, 'expired token'))
    } else {
      const processingImage = groupSelectors.addPhotoSelectors.processingImageForUploadId(
        this.store.getState().group.addPhoto,
        e.id
      )
      if (processingImage) {
        this.store.dispatch(
          groupActions.addPhoto.error({
            uuid: processingImage.uuid,
            uploadId: e.id,
            underlyingError: `Response code: ${responseCode}`,
            type: 'upload'
          })
        )
      }
      this.store.dispatch(
        fileSyncActions.error(e.id, `Response code: ${responseCode}`)
      )
    }
  }

  uploadCancelled(e: any) {
    const processingImage = groupSelectors.addPhotoSelectors.processingImageForUploadId(
      this.store.getState().group.addPhoto,
      e.id
    )
    if (processingImage) {
      this.store.dispatch(
        groupActions.addPhoto.error({
          uuid: processingImage.uuid,
          uploadId: e.id,
          underlyingError: 'Cancelled',
          type: 'upload'
        })
      )
    }
    this.store.dispatch(fileSyncActions.error(e.id, 'Cancelled'))
  }

  uploadError(e: any) {
    const processingImage = groupSelectors.addPhotoSelectors.processingImageForUploadId(
      this.store.getState().group.addPhoto,
      e.id
    )
    if (processingImage) {
      this.store.dispatch(
        groupActions.addPhoto.error({
          uuid: processingImage.uuid,
          uploadId: e.id,
          underlyingError: e.error,
          type: 'upload'
        })
      )
    }
    this.store.dispatch(fileSyncActions.error(e.id, e.error))
  }

  setup() {
    Upload.addListener('progress', undefined, this.uploadProgress.bind(this))
    Upload.addListener('completed', undefined, this.uploadComplete.bind(this))
    Upload.addListener('cancelled', undefined, this.uploadCancelled.bind(this))
    Upload.addListener('error', undefined, this.uploadError.bind(this))
  }

  tearDown() {
    // TODO: Do we need to unsubscribe?
  }
}
