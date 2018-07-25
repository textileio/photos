import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  locationUpdate: null,
  backgroundTask: null,

  urisToIgnore: ['uris'],
  imageAdded: ['uri', 'thread', 'hash', 'remotePayloadPath'],
  imageUploadRetried: ['hash'],

  imageUploadProgress: ['data'],
  imageUploadComplete: ['data'],
  imageUploadError: ['data'],
  imageRemovalComplete: ['id'],

  photosTaskError: ['error'],
  photosProcessing: ['photos'],
  photoProcessingError: ['uri', 'error']
})

export const TextileTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  images: {
    error: false,
    loading: false,
    items: []
  },
  camera: {}
})

/* ------------- Selectors ------------- */
export const TextileSelectors = {
  // TODO: Add more selectors here as we learn how they are used
  itemsById: (state, id) => {
    return state.textile.images.items.filter(item => item.hash === id)
  },
  camera: state => state.textile.camera
}

/* ------------- Reducers ------------- */

// Used to ignore certain URIs in the CameraRoll
export const handleUrisToIgnore = (state, {uris}) => {
  let newUri = {}
  for (let uri of uris) {
    newUri[uri] = 'complete'
  }
  let processed = state.camera && state.camera.processed ? state.camera.processed.merge(newUri) : newUri
  return state.merge({ camera: { processed } })
}

export const handlePhotosProcessing = (state, {photos}) => {
  let newUri = {}
  for (let photo of photos) {
    newUri[photo.uri] = 'processing'
  }
  let processed = state.camera && state.camera.processed ? state.camera.processed.merge(newUri) : newUri
  return state.merge({ camera: { processed } })
}

export const handlePhotoProcessingError = (state, {uri, error}) => {
  let newUri = {}
  newUri[uri] = 'error'
  let processed = state.camera && state.camera.processed ? state.camera.processed.merge(newUri) : newUri
  return state.merge({ camera: { processed } })
}

export const handleImageAdded = (state, {uri, thread, hash, remotePayloadPath}) => {
  let newUri = {}
  newUri[uri] = 'complete'
  console.log('IGNORE NEW', uri)
  const processed = state.camera && state.camera.processed ? state.camera.processed.merge(newUri) : newUri
  console.log('processed')
  console.log(processed)
  const items = [{ thread, hash, remotePayloadPath, state: 'pending', remainingUploadAttempts: 3 }, ...state.images.items]
  return state.merge({ images: { items }, camera: { processed } })
}

export const handleImageUploadRetried = (state, {hash}) => {
  const items = state.images.items.map(item => {
    if (item.hash === hash) {
      return {...item, state: 'pending'}
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const handleImageProgress = (state, {data}) => {
  const { id, progress } = data
  console.log('progress')
  console.log(data)
  // The upload library we're using returns float 0.0 - 100.0
  const fractionalProgress = progress / 100.0
  const items = state.images.items.map(item => {
    if (item.hash === id) {
      return {...item, state: 'processing', progress: fractionalProgress}
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const handleImageUploadComplete = (state, {data}) => {
  const { id } = data
  console.log('complete2')
  console.log(data)
  const items = state.images.items.map(item => {
    if (item.hash === id) {
      return {...item, state: 'complete', id}
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const handleImageUploadError = (state, {data}) => {
  const { error, id } = data
  console.log('error')
  console.log(data)
  const items = state.images.items.map(item => {
    if (item.hash === id) {
      return {
        ...item,
        remainingUploadAttempts: item.remainingUploadAttempts - 1,
        state: 'error',
        error: error,
        id
      }
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const imageRemovalComplete = (state, {id}) => {
  const items = state.images.items.filter(item => item.hash !== id)
  return state.merge({ images: { items } })
}

// Helper so sagas can figure out current items loaded
// const getItems = state => state.items

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PHOTOS_PROCESSING]: handlePhotosProcessing,
  [Types.PHOTO_PROCESSING_ERROR]: handlePhotoProcessingError,

  [Types.IMAGE_ADDED]: handleImageAdded,
  [Types.URIS_TO_IGNORE]: handleUrisToIgnore,
  [Types.IMAGE_UPLOAD_RETRIED]: handleImageUploadRetried,

  [Types.IMAGE_UPLOAD_PROGRESS]: handleImageProgress,
  [Types.IMAGE_UPLOAD_COMPLETE]: handleImageUploadComplete,
  [Types.IMAGE_UPLOAD_ERROR]: handleImageUploadError,
  [Types.IMAGE_REMOVAL_COMPLETE]: imageRemovalComplete
})
