import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  randomUsersRequest: ['seed', 'page', 'results'],
  randomUsersRequestSuccess: ['data'],
  randomUsersRequestFailure: null,

  createNode: ['path', 'apiHost'],

  startNodeRequest: null,
  startNodeSuccess: null,
  startNodeFailure: null,

  stopNodeRequest: null,
  stopNodeSuccess: null,
  stopNodeFailure: null,

  imageAdded: ['image'],
  imageProcessing: ['image'],
  imageSuccess: ['image'],
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
  getPhotoDataFailure: null
})

export const TextileTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  randomUserData: null,
  fetching: null,
  error: null,
  nodeState: {
    state: 'stopped',
    error: false,
    path: null,
    apiHost: null
  },
  images: {
    error: false,
    loading: false,
    items: []
  }
})

/* ------------- Selectors ------------- */

export const TextileSelectors = {
  getRandomUserData: state => state.textile.randomUserData
  // TODO: Add more selectors here as we learn how they are used
}

/* ------------- Reducers ------------- */

// request the data from an api
export const randomUsersRequest = state => {
  return state.merge({ fetching: true })
}

// successful api lookup
export const randomUsersRequestSuccess = (state, action) => {
  const { data } = action
  return state.merge({ fetching: false, randomUserData: data })
}

// Something went wrong somewhere.
export const randomUsersRequestFailure = state =>
  state.merge({ fetching: false, error: true, randomUserData: null })

export const createNode = (state, {path, apiHost}) =>
  state.merge({
    nodeState: {
      path: path,
      apiHost: apiHost
    }
  })

export const startNodeRequest = state =>
  state.merge({
    nodeState: {
      state: 'starting',
      error: false
    }
  })

export const startNodeSuccess = state =>
  state.merge({
    nodeState: {
      state: 'started',
      error: false
    }
  })

export const startNodeFailure = state =>
  state.merge({
    nodeState: {
      state: 'stopped',
      error: true
    }
  })

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

export const handleImageAdded = (state, {image}) => {
  const existingItems = state.images.items ? state.images.items : []
  const items = [{ image, state: 'pending' }, ...existingItems]
  return state.merge({ images: { items } })
}

export const handleImageProcessing = (state, {image}) => {
  const existingItems = state.images.items ? state.images.items : []
  const items = existingItems.map(item => {
    if (item.image.node.image.uri === image.node.image.uri) {
      return { image, state: 'processing' }
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const handleImageSuccess = (state, {image}) => {
  const existingItems = state.images.items ? state.images.items : []
  const items = existingItems.map(item => {
    if (item.image.node.image.uri === image.node.image.uri) {
      return { image, state: 'complete' }
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const handleImageError = (state, {image, error}) => {
  const existingItems = state.images.items ? state.images.items : []
  const items = existingItems.map(item => {
    if (item.image.node.image.uri === image.node.image.uri) {
      return { image, state: 'error', error }
    }
    return item
  })
  return state.merge({ images: { items } })
}

// TODO: add a loading state for addImages
export const addImagesRequest = state => state

// Helper so sagas can figure out current items loaded
// const getItems = state => state.items

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RANDOM_USERS_REQUEST]: randomUsersRequest,
  [Types.RANDOM_USERS_REQUEST_SUCCESS]: randomUsersRequestSuccess,
  [Types.RANDOM_USERS_REQUEST_FAILURE]: randomUsersRequestFailure,

  [Types.CREATE_NODE]: createNode,
  [Types.START_NODE_REQUEST]: startNodeRequest,
  [Types.START_NODE_SUCCESS]: startNodeSuccess,
  [Types.START_NODE_FAILURE]: startNodeFailure,

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
  [Types.IMAGE_PROCESSING]: handleImageProcessing,
  [Types.IMAGE_SUCCESS]: handleImageSuccess,
  [Types.IMAGE_ERROR]: handleImageError
})
