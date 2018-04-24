import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  onboardedSuccess: null,

  appStateChange: ['newState'],
  locationUpdate: null,

  imageAdded: ['image', 'remotePayloadPath'],
  imageUploadProgress: ['data'],
  imageUploadComplete: ['data'],
  imageUploadError: ['data'],
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
  const {file} = data
  const existingItems = state.images.items ? state.images.items : []
  const items = existingItems.map(item => {
    if (item.remotePayloadPath === file) {
      return {...item, state: 'complete'}
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const handleImageUploadError = (state, {data}) => {
  const {file, error} = data
  const existingItems = state.images.items ? state.images.items : []
  const items = existingItems.map(item => {
    if (item.remotePayloadPath === file) {
      return {...item, state: 'error', error: error.message}
    }
    return item
  })
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

// Helper so sagas can figure out current items loaded
// const getItems = state => state.items

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ONBOARDED_SUCCESS]: onboardedSuccess,

  [Types.IMAGE_ADDED]: handleImageAdded,
  [Types.IMAGE_UPLOAD_PROGRESS]: handleImageProgress,
  [Types.IMAGE_UPLOAD_COMPLETE]: handleImageUploadComplete,
  [Types.IMAGE_UPLOAD_ERROR]: handleImageUploadError,

  [Types.PAIR_NEW_DEVICE]: pairNewDevice,
  [Types.PAIR_NEW_DEVICE_SUCCESS]: pairNewDeviceSuccess,
  [Types.PAIR_NEW_DEVICE_ERROR]: pairNewDeviceError
})
