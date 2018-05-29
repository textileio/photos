import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  onboardedSuccess: null,

  locationUpdate: null,
  backgroundTask: null,

  newImage: ['uri'],
  imageAdded: ['thread', 'hash', 'remotePayloadPath'],

  imageUploadProgress: ['data'],
  imageUploadComplete: ['data'],
  imageUploadCancelled: ['data'],
  imageUploadError: ['data'],
  imageRemovalComplete: ['id'],
  photosTaskError: ['error'],

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
  camera: {
    processed: []
  },
  devices: []
})


/* ------------- Selectors ------------- */
export const TextileSelectors = {
  // TODO: Add more selectors here as we learn how they are used
  itemsById: (state, id) => {
    return state.textile.images.items.filter(item => item.hash === id)
  },
  onboarded: state => state.textile.onboarded,
  camera: state => state.textile.camera
}

/* ------------- Reducers ------------- */

export const onboardedSuccess = state => {
  return state.merge({ onboarded: true })
}

export const handleImageAdded = (state, {thread, hash, remotePayloadPath}) => {
  const items = [{ thread, hash, remotePayloadPath, state: 'pending' }, ...state.images.items]
  return state.merge({ images: { items } })
}

export const handleImageProgress = (state, {data}) => {
  const { id, progress } = data
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
  const items = state.images.items.map(item => {
    if (item.hash === id) {
      return {...item, state: 'complete', id}
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const handleImageUploadCancelled = (state, {data}) => {
  const { id } = data
  const items = state.images.items.map(item => {
    if (item.hash === id) {
      return {...item, state: 'error', error: 'Upload cancelled'}
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const handleImageUploadError = (state, {data}) => {
  const { error, id } = data
  const items = state.images.items.map(item => {
    if (item.hash === id) {
      return {...item, state: 'error', error: error}
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const imageRemovalComplete = (state, {id}) => {
  const items = state.images.items.filter(item => item.hash !== id)
  return state.merge({ images: { items } })
}

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

export const handleNewImage = (state, {uri}) => {
  const processed = state.camera && state.camera.processed ? state.camera.processed : []
  let camera = {processed: [uri, ...processed]}
  return state.merge({ camera })
}

// Helper so sagas can figure out current items loaded
// const getItems = state => state.items

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ONBOARDED_SUCCESS]: onboardedSuccess,

  [Types.NEW_IMAGE]: handleNewImage,
  [Types.IMAGE_ADDED]: handleImageAdded,

  [Types.IMAGE_UPLOAD_PROGRESS]: handleImageProgress,
  [Types.IMAGE_UPLOAD_COMPLETE]: handleImageUploadComplete,
  [Types.IMAGE_UPLOAD_CANCELLED]: handleImageUploadCancelled,
  [Types.IMAGE_UPLOAD_ERROR]: handleImageUploadError,
  [Types.IMAGE_REMOVAL_COMPLETE]: imageRemovalComplete,

  [Types.PAIR_NEW_DEVICE]: pairNewDevice,
  [Types.PAIR_NEW_DEVICE_SUCCESS]: pairNewDeviceSuccess,
  [Types.PAIR_NEW_DEVICE_ERROR]: pairNewDeviceError
})
