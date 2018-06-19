import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  onboardedSuccess: null,

  toggleVerboseUi: null,

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
  photoProcessingError: ['id', 'error'],

  pairDevice: ['pubKey'],
  pairDeviceSuccess: ['pubKey'],
  pairDeviceError: ['pubKey']
})

export const TextileTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  onboarded: false,
  preferences: {
    verboseUi: false
  },
  images: {
    error: false,
    loading: false,
    items: []
  },
  camera: {},
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

// Used to ignore certain URIs in the CameraRoll
export const handleUrisToIgnore = (state, {uris}) => {
  const existing = state.camera && state.camera.processed ? state.camera.processed : []
  const processed = [...existing, ...uris]
  return state.merge({ camera: {processed} })
}

export const toggleVerboseUi = state =>
  state.merge({ preferences: { ...state.preferences, verboseUi: !state.preferences.verboseUi } })

export const handleImageAdded = (state, {uri, thread, hash, remotePayloadPath}) => {
  const existing = state.camera && state.camera.processed ? state.camera.processed : []
  const processed = [...existing, uri]
  const items = [{ thread, hash, remotePayloadPath, state: 'pending', remainingUploadAttempts: 3 }, ...state.images.items]
  return state.merge({ images: { items }, camera: {processed} })
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

export const handleImageUploadError = (state, {data}) => {
  const { error, id } = data
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

export const pairDevice = (state, {pubKey}) => {
  const existingDevices = state.devices ? state.devices : []
  const devices = [{ pubKey, state: 'pending' }, ...existingDevices]
  return state.merge({ devices })
}

export const pairDeviceSuccess = (state, {pubKey}) => {
  const existingDevices = state.devices ? state.devices : []
  const devices = existingDevices.map(device => {
    if (device.pubKey === pubKey) {
      return { pubKey: device.pubKey, state: 'paired' }
    }
    return device
  })
  return state.merge({ devices })
}

export const pairDeviceError = (state, {pubKey}) => {
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

  [Types.TOGGLE_VERBOSE_UI]: toggleVerboseUi,
  [Types.IMAGE_ADDED]: handleImageAdded,
  [Types.URIS_TO_IGNORE]: handleUrisToIgnore,
  [Types.IMAGE_UPLOAD_RETRIED]: handleImageUploadRetried,

  [Types.IMAGE_UPLOAD_PROGRESS]: handleImageProgress,
  [Types.IMAGE_UPLOAD_COMPLETE]: handleImageUploadComplete,
  [Types.IMAGE_UPLOAD_ERROR]: handleImageUploadError,
  [Types.IMAGE_REMOVAL_COMPLETE]: imageRemovalComplete,

  [Types.PAIR_DEVICE]: pairDevice,
  [Types.PAIR_DEVICE_SUCCESS]: pairDeviceSuccess,
  [Types.PAIR_DEVICE_ERROR]: pairDeviceError
})
