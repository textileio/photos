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

  addImageRequest: ['path'],
  addImageSuccess: ['hash'],
  addImageFailure: null,

  getPhotosRequest: ['offset', 'limit'],
  getPhotosSuccess: ['data'],
  getPhotosFailure: null,

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

export const createNode = (state, { path, apiHost }) =>
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

export const getPhotosRequest = state =>
  state.merge({
    images: {
      loading: true
    }
  })

export const getPhotosSuccess = (state, { data }) => {
  // Suspicious that redux-persist is clearing out our INITIAL_STATE
  // empty array of images.
  const existingImages = state.images.items ? state.images.items : []
  return state.merge({
    images: {
      loading: false,
      items: [...existingImages, ...data.hashes]
    }
  })
}

export const getPhotosFailure = state =>
  state.merge({
    images: {
      loading: false,
      error: true
    }
  })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RANDOM_USERS_REQUEST]: randomUsersRequest,
  [Types.RANDOM_USERS_REQUEST_SUCCESS]: randomUsersRequestSuccess,
  [Types.RANDOM_USERS_REQUEST_FAILURE]: randomUsersRequestFailure,

  [Types.CREATE_NODE]: createNode,
  [Types.START_NODE_REQUEST]: startNodeRequest,
  [Types.START_NODE_SUCCESS]: startNodeSuccess,
  [Types.START_NODE_FAILURE]: startNodeFailure,

  [Types.GET_PHOTOS_REQUEST]: getPhotosRequest,
  [Types.GET_PHOTOS_SUCCESS]: getPhotosSuccess,
  [Types.GET_PHOTOS_FAILURE]: getPhotosFailure
})
