import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  onboardedSuccess: null,

  imageAdded: ['image', 'remotePayloadPath'],
  imageUploadProgress: ['data'],
  imageUploadComplete: ['data'],
  imageSuccess: ['image', 'hash'],
  imageError: ['image', 'error'],

  getHashesRequest: ['offsetId', 'limit', 'clearItems'],
  getHashesSuccess: null,
  getHashesFailure: null,

  getThumbsRequest: ['response', 'prepend', 'clearItems'],
  getThumbsSuccess: ['response', 'prepend', 'clearItems'],

  addImagesRequest: ['data'],
  addImagesSuccess: ['data'],

  // TODO: eval if below methods are still needed
  addImageRequest: ['path'],
  addImageSuccess: ['hash'],
  addImageFailure: null,

  reloadPhotos: null,

  getPhotoDataRequest: ['hash'],
  getPhotoDataSuccess: ['data'],
  getPhotoDataFailure: null,

  pairNewDevice: ['pubKey'],
  pairNewDeviceSuccess: ['pubKey'],
  pairNewDeviceError: ['pubKey']
})

export const TextileTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  onboarded: false,
  images: {
    error: false,
    loading: false,
    items: []
  },
  devices: []
})

/* ------------- Selectors ------------- */

export const TextileSelectors = {
  // TODO: Add more selectors here as we learn how they are used
}

/* ------------- Reducers ------------- */

export const onboardedSuccess = state => {
  return state.merge({ onboarded: true })
}

export const getHashesRequest = state => {
  const existingImages = state.image && state.images.items ? state.images.items : []
  return state.merge({
    images: {
      loading: true,
      items: existingImages
    }
  })
}

// TODO: determine if we want any feedback here
export const getHashesSuccess = state => state

export const getHashesFailure = state => {
  const existingImages = state.images.items ? state.images.items : []
  return state.merge({
    images: {
      loading: false,
      error: true,
      items: existingImages
    }
  })
}

export const getThumbsRequest = state => {
  const existingImages = state.images.items ? state.images.items : []
  return state.merge({
    images: {
      loading: true,
      items: existingImages
    }
  })
}

export const getThumbsSuccess = (state, { response, prepend, clearItems }) => {
  // Suspicious that redux-persist is clearing out our INITIAL_STATE
  // empty array of images.
  let newItems = response
  if (!clearItems) {
    const existingImages = state.images.items ? state.images.items : []
    newItems = prepend ? [...newItems, ...existingImages] : [...existingImages, ...newItems]
  }
  return state.merge({
    images: {
      loading: false,
      items: newItems
    }
  })
}

export const handleImageAdded = (state, {image, remotePayloadPath}) => {
  const existingItems = state.images.items ? state.images.items : []
  const items = [{ image, remotePayloadPath, state: 'pending' }, ...existingItems]
  return state.merge({ images: { items } })
}

export const handleImageProgress = (state, {data}) => {
  const {file, progress} = data
  const existingItems = state.images.items ? state.images.items : []
  const items = existingItems.map(item => {
    if (item.remotePayloadPath === file) {
      return {...item, state: 'processing', progress}
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const handleImageUploadComplete = (state, {data}) => {
  const {file, error} = data
  const existingItems = state.images.items ? state.images.items : []
  const items = existingItems.map(item => {
    if (item.remotePayloadPath === file) {
      if (error) {
        return {...item, state: 'error', error}
      } else {
        return {...item, state: 'complete'}
      }
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const handleImageSuccess = (state, {image, hash}) => {
  const existingItems = state.images.items ? state.images.items : []
  const items = existingItems.map(item => {
    if (item.image.node.image.uri === image.node.image.uri) {
      return { image, hash, state: 'complete' }
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const handleImageError = (state, {image, error}) => {
  const existingItems = state.images.items ? state.images.items : []
  const items = existingItems.map(item => {
    if (item.image.node.image.uri === image.node.image.uri) {
      return { image, state: 'error', error: error.message }
    }
    return item
  })
  return state.merge({ images: { items } })
}

// TODO: add a loading state for addImages
export const addImagesRequest = state => state

export const pairNewDevice = (state, {pubKey}) => {
  const existingDevices = state.devices ? state.devices : []
  const devices = [{ pubKey, state: 'pending' }, ...existingDevices]
  return state.merge({ devices })
}

export const pairNewDeviceSuccess = (state, {pubKey}) => {
  const existingDevices = state.devices ? state.devices : []
  const devices = existingDevices.map(device => {
    if (device.pubKey === pubKey) {
      return { pubKey: device.pubKey, state: 'paired' }
    }
    return device
  })
  return state.merge({ devices })
}

export const pairNewDeviceError = (state, {pubKey}) => {
  const existingDevices = state.devices ? state.devices : []
  const devices = existingDevices.map(device => {
    if (device.pubKey === pubKey) {
      return { pubKey: device.pubKey, state: 'error' }
    }
    return device
  })
  return state.merge({ devices })
}

// Helper so sagas can figure out current items loaded
// const getItems = state => state.items

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ONBOARDED_SUCCESS]: onboardedSuccess,

  // [Types.GET_HASHES_REQUEST]: getHashesRequest,
  // [Types.GET_HASHES_SUCCESS]: getHashesSuccess,
  // [Types.GET_HASHES_FAILURE]: getHashesFailure,
  //
  // [Types.GET_THUMBS_REQUEST]: getThumbsRequest,
  // [Types.GET_THUMBS_SUCCESS]: getThumbsSuccess,
  //
  // [Types.ADD_IMAGES_REQUEST]: addImagesRequest,
  // // TODO: Should this use its own handler? Not yet.
  // [Types.ADD_IMAGES_SUCCESS]: getThumbsSuccess,

  [Types.IMAGE_ADDED]: handleImageAdded,
  [Types.IMAGE_UPLOAD_PROGRESS]: handleImageProgress,
  [Types.IMAGE_UPLOAD_COMPLETE]: handleImageUploadComplete,
  [Types.IMAGE_SUCCESS]: handleImageSuccess,
  [Types.IMAGE_ERROR]: handleImageError,

  [Types.PAIR_NEW_DEVICE]: pairNewDevice,
  [Types.PAIR_NEW_DEVICE_SUCCESS]: pairNewDeviceSuccess,
  [Types.PAIR_NEW_DEVICE_ERROR]: pairNewDeviceError
})
