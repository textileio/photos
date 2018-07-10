import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { arrayify } from '../../node_modules/tslint/lib/utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  onboardedSuccess: null,

  toggleVerboseUi: null,

  locationUpdate: null,
  backgroundTask: null,

  urisToIgnore: ['uris'],
  imageAdded: ['uri', 'thread', 'pinRequests'],
  imageUploadRetried: ['hash'],

  imageUploadProgress: ['data'],
  imageUploadComplete: ['data'],
  imageUploadError: ['data'],
  imageRemovalComplete: ['id'],

  photosTaskError: ['error'],
  photosProcessing: ['photos'],
  photoProcessingError: ['uri', 'error'],

  pairNewDevice: ['pubKey'],
  pairNewDeviceSuccess: ['pubKey'],
  pairNewDeviceError: ['pubKey']
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
    return state.textile.images.items
      .map(item => item.pinRequests)
      .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
      .filter(pinRequest => pinRequest.hash === id)
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
  let newUri = {}
  for (let uri of uris) {
    newUri[uri] = 'complete'
  }
  let processed = state.camera && state.camera.processed ? state.camera.processed.merge(newUri) : newUri
  return state.merge({ camera: { processed } })
}

export const toggleVerboseUi = state =>
  state.merge({ preferences: { ...state.preferences, verboseUi: !state.preferences.verboseUi } })

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

export const handleImageAdded = (state, {uri, thread, pinRequests}) => {
  let newUri = {}
  newUri[uri] = 'complete'
  const processed = state.camera && state.camera.processed ? state.camera.processed.merge(newUri) : newUri
  const pinRequestsData = pinRequests.map(pinRequest => {
    return { 
      hash: pinRequest.Boundary, 
      payloadPath: pinRequest.PayloadPath,
      state: 'pending',
      remainingUploadAttempts: 3
    }
  })
  const items = [{ thread, pinRequests: pinRequestsData }, ...state.images.items]
  return state.merge({ images: { items }, camera: { processed } })
}

export const handleImageUploadRetried = (state, {hash}) => {
  const items = state.images.items.map(item => {
    const pinRequests = item.pinRequests.map(pinRequest => {
      if (pinRequest.hash === hash) {
        return {...pinRequest, state: 'pending'}
      }
      return pinRequest
    })
    return {...item, pinRequests}
  })
  return state.merge({ images: { items } })
}

export const handleImageProgress = (state, {data}) => {
  const { id, progress } = data
  // The upload library we're using returns float 0.0 - 100.0
  const fractionalProgress = progress / 100.0
  const items = state.images.items.map(item => {
    const pinRequests = item.pinRequests.map(pinRequest => {
      if (pinRequest.hash === id) {
        return {...pinRequest, state: 'processing', progress: fractionalProgress}
      }
      return pinRequest
    })
    return {...item, pinRequests}
  })
  return state.merge({ images: { items } })
}

export const handleImageUploadComplete = (state, {data}) => {
  const { id } = data
  const items = state.images.items.map(item => {
    const pinRequests = item.pinRequests.map(pinRequest => {
      if (pinRequest.hash === id) {
        return {...pinRequest, state: 'complete', id}
      }
      return pinRequest
    })
    return {...item, pinRequests}
  })
  return state.merge({ images: { items } })
}

export const handleImageUploadError = (state, {data}) => {
  const { error, id } = data
  const items = state.images.items.map(item => {
    const pinRequests = item.pinRequests.map(pinRequest => {
      if (pinRequest.hash === id) {
        return {
          ...pinRequest,
          remainingUploadAttempts: pinRequest.remainingUploadAttempts - 1,
          state: 'error',
          error: error,
          id
        }
      }
      return pinRequest
    })
    return {...item, pinRequests}
  })
  return state.merge({ images: { items } })
}

export const imageRemovalComplete = (state, {id}) => {
  const items = state.images.items
    .map(item => {
      const pinRequests = item.pinRequests.filter(pinRequest => pinRequest.hash !== id)
      return {...item, pinRequests}
    })
    .filter(item => item.pinRequests.length > 0)
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

  [Types.TOGGLE_VERBOSE_UI]: toggleVerboseUi,
  [Types.PHOTOS_PROCESSING]: handlePhotosProcessing,
  [Types.PHOTO_PROCESSING_ERROR]: handlePhotoProcessingError,

  [Types.IMAGE_ADDED]: handleImageAdded,
  [Types.URIS_TO_IGNORE]: handleUrisToIgnore,
  [Types.IMAGE_UPLOAD_RETRIED]: handleImageUploadRetried,

  [Types.IMAGE_UPLOAD_PROGRESS]: handleImageProgress,
  [Types.IMAGE_UPLOAD_COMPLETE]: handleImageUploadComplete,
  [Types.IMAGE_UPLOAD_ERROR]: handleImageUploadError,
  [Types.IMAGE_REMOVAL_COMPLETE]: imageRemovalComplete,

  [Types.PAIR_NEW_DEVICE]: pairNewDevice,
  [Types.PAIR_NEW_DEVICE_SUCCESS]: pairNewDeviceSuccess,
  [Types.PAIR_NEW_DEVICE_ERROR]: pairNewDeviceError
})
