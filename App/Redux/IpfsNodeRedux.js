import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  createNodeRequest: ['path'],
  createNodeSuccess: null,
  createNodeFailure: ['error'],
  startNodeRequest: null,
  startNodeSuccess: null,
  startNodeFailure: ['error'],
  stopNodeRequest: null,
  stopNodeSuccess: null,
  stopNodeFailure: ['error'],
  getPhotoHashesRequest: ['thread'],
  getPhotoHashesSuccess: ['thread', 'data'],
  getPhotoHashesFailure: ['thread', 'error']
})

export const IpfsNodeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  nodeState: {
    state: 'undefined', // | creating | stopped | starting | started | stopping
    error: null
  },
  threads: {
    default: {
      querying: false,
      hashes: [],
      error: null
    },
    beta: {
      querying: false,
      hashes: [],
      error: null
    }
  }
})

/* ------------- Selectors ------------- */

export const IpfsNodeSelectors = {
}

/* ------------- Reducers ------------- */

export const creatingNode = state =>
  state.merge({...state, nodeState: {state: 'creating', error: null}})

export const nodeCreated = state =>
  state.merge({...state, nodeState: {state: 'stopped', error: null}})

export const nodeStarting = state =>
  state.merge({...state, nodeState: {state: 'starting', error: null}})

export const nodeStarted = state =>
  state.merge({...state, nodeState: {state: 'started', error: null}})

export const nodeStopping = state =>
  state.merge({...state, nodeState: {state: 'stopping', error: null}})

export const nodeStopped = state =>
  state.merge({...state, nodeState: {state: 'stopped', error: null}})

export const nodeError = (state, {error}) =>
  state.merge({...state, nodeState: {error: error}})

export const photoHashesRequest = (state, {thread}) => {
  const currentThreadState = state.threads[thread]
  const newThreadState = currentThreadState.merge({querying: true})
  const newThreads = state.threads.set(thread, newThreadState)
  return state.merge({...state, threads: newThreads})
}

export const photoHashesSuccess = (state, {thread, data}) => {
  const currentThreadState = state.threads[thread]
  const newThreadState = currentThreadState.merge({
    querying: false,
    hashes: data.paths // data actually contains {hashes, paths}
  })
  const newThreads = state.threads.set(thread, newThreadState)
  return state.merge({...state, threads: newThreads})
}

export const photoHashesFailure = (state, {thread, error}) => {
  const currentThreadState = state.threads[thread]
  const newThreadState = currentThreadState.merge({querying: false, error})
  const newThreads = state.threads.set(thread, newThreadState)
  return state.merge({...state, threads: newThreads})
}

// Helper so sagas can figure out current items loaded
// const getItems = state => state.items

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_NODE_REQUEST]: creatingNode,
  [Types.CREATE_NODE_SUCCESS]: nodeCreated,
  [Types.CREATE_NODE_FAILURE]: nodeError,

  [Types.START_NODE_REQUEST]: nodeStarting,
  [Types.START_NODE_SUCCESS]: nodeStarted,
  [Types.START_NODE_FAILURE]: nodeError,

  [Types.STOP_NODE_REQUEST]: nodeStopping,
  [Types.STOP_NODE_SUCCESS]: nodeStopped,
  [Types.STOP_NODE_FAILURE]: nodeError,

  [Types.GET_PHOTO_HASHES_REQUEST]: photoHashesRequest,
  [Types.GET_PHOTO_HASHES_SUCCESS]: photoHashesSuccess,
  [Types.GET_PHOTO_HASHES_FAILURE]: photoHashesFailure
})
