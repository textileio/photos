import actions, { reducer, UploadingImage } from '../UploadingImagesRedux'

const initialState = reducer(undefined, {} as any)

const path = 'path'
const dataId = 'dataId'
const attempts = 3
const uploadProgress = 0.5
const error = new Error('oops')

const addedImage: UploadingImage = {
  dataId,
  path,
  remainingUploadAttempts: attempts,
  state: 'pending',
  uploadProgress: 0
}

const progressImage: UploadingImage = {
  ...addedImage,
  uploadProgress,
  state: 'uploading'
}

const errorImage: UploadingImage = {
  ...progressImage,
  errorMessage: error.message,
  remainingUploadAttempts: progressImage.remainingUploadAttempts - 1
}

const retriedImage: UploadingImage = {
  ...errorImage,
  state: 'pending',
  uploadProgress: 0,
  errorMessage: undefined
}

describe('images stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('tracking upload state', () => {
    it('should add a photo', () => {
      const state0 = reducer(initialState, actions.addImage(path, dataId, attempts))
      expect(state0.images[dataId]).toMatchObject(addedImage)
    })
    it('should track upload progress', () => {
      const state0 = reducer(initialState, actions.addImage(path, dataId, attempts))
      const state1 = reducer(state0, actions.imageUploadProgress(dataId, uploadProgress))
      expect(state1.images[dataId]).toMatchObject(progressImage)
    })
    it('should remove record on complete', () => {
      const state0 = reducer(initialState, actions.addImage(path, dataId, attempts))
      const state1 = reducer(state0, actions.imageUploadProgress(dataId, uploadProgress))
      const state2 = reducer(state1, actions.imageUploadComplete(dataId))
      expect(state2.images[dataId]).toBeUndefined()
    })
    it('should track an upload error', () => {
      const state0 = reducer(initialState, actions.addImage(path, dataId, attempts))
      const state1 = reducer(state0, actions.imageUploadProgress(dataId, uploadProgress))
      const state2 = reducer(state1, actions.imageUploadError(dataId, error))
      expect(state2.images[dataId]).toMatchObject(errorImage)
    })
    it('should track retrying an image upload', () => {
      const state0 = reducer(initialState, actions.addImage(path, dataId, attempts))
      const state1 = reducer(state0, actions.imageUploadProgress(dataId, uploadProgress))
      const state2 = reducer(state1, actions.imageUploadError(dataId, error))
      const state3 = reducer(state2, actions.imageUploadRetried(dataId))
      expect(state3.images[dataId]).toMatchObject(retriedImage)
    })
  })
})