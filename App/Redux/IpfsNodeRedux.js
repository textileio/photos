import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  createNodeRequest: ['path'],
  createNodeSuccess: null,
  createNodeFailure: ['error'],
  startGatewayRequest: null,
  startGatewaySuccess: null,
  startGatewayFailure: ['error'],
  startNodeRequest: null,
  startNodeSuccess: null,
  startNodeFailure: ['error'],
  stopNodeRequest: null,
  stopNodeSuccess: null,
  stopNodeFailure: ['error']
})

export const IpfsNodeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  nodeState: {
    state: 'undefined', // | creating | stopped | starting | started | stopping
    error: null
  },
  gatewayState: {
    state: 'stopped', // | starting | started
    error: null
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

export const gatewayStarting = state =>
  state.merge({...state, gatewayState: {state: 'starting', error: null}})

export const gatewayStarted = state =>
  state.merge({...state, gatewayState: {state: 'started', error: null}})

export const gatewayError = (state, {error}) =>
  state.merge({...state, gatewayState: {error: error}})

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

// Helper so sagas can figure out current items loaded
// const getItems = state => state.items

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CREATE_NODE_REQUEST]: creatingNode,
  [Types.CREATE_NODE_SUCCESS]: nodeCreated,
  [Types.CREATE_NODE_FAILURE]: nodeError,

  [Types.START_GATEWAY_REQUEST]: gatewayStarting,
  [Types.START_GATEWAY_SUCCESS]: gatewayStarted,
  [Types.START_GATEWAY_FAILURE]: gatewayError,

  [Types.START_NODE_REQUEST]: nodeStarting,
  [Types.START_NODE_SUCCESS]: nodeStarted,
  [Types.START_NODE_FAILURE]: nodeError,

  [Types.STOP_NODE_REQUEST]: nodeStopping,
  [Types.STOP_NODE_SUCCESS]: nodeStopped,
  [Types.STOP_NODE_FAILURE]: nodeError
})
