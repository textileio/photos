import { createAction, ActionType, getType } from 'typesafe-actions'
import { AppStateStatus } from 'react-native'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  lock: createAction('LOCK', resolve => {
    return (value: boolean) => resolve({ value })
  }),
  appStateChange: createAction('APP_STATE_CHANGE', resolve => {
    return (previousState: TextileAppStateStatus, newState: AppStateStatus) => resolve({ previousState, newState })
  }),
  createNodeRequest: createAction('CREATE_NODE_REQUEST', resolve => {
    return (path: string) => resolve({ path })
  }),
  createNodeSuccess: createAction('CREATE_NODE_SUCCESS', resolve => {
    return () => resolve()
  }),
  createNodeFailure: createAction('CREATE_NODE_FAILURE', resolve => {
    return (error: Error) => resolve({ error })
  }),
  startNodeRequest: createAction('START_NODE_REQUEST', resolve => {
    return () => resolve()
  }),
  startNodeSuccess: createAction('START_NODE_SUCCESS', resolve => {
    return () => resolve()
  }),
  startNodeFailure: createAction('START_NODE_FAILURE', resolve => {
    return (error: Error) => resolve({ error })
  }),
  stopNodeRequest: createAction('STOP_NODE_REQUEST', resolve => {
    return () => resolve()
  }),
  stopNodeSuccess: createAction('STOP_NODE_SUCCESS', resolve => {
    return () => resolve()
  }),
  stopNodeFailure: createAction('STOP_NODE_FAILURE', resolve => {
    return (error: Error) => resolve({ error })
  }),
  nodeOnline: createAction('NODE_ONLINE', resolve => {
    return () => resolve()
  }),
  getPhotoHashesRequest: createAction('GET_PHOTO_HASHES_REQUEST', resolve => {
    return (threadId: string) => resolve({ threadId })
  }),
  getPhotoHashesSuccess: createAction('GET_PHOTO_HASHES_SUCCESS', resolve => {
    return (threadId: string, items: PhotosQueryResult[]) => resolve({ threadId, items })
  }),
  getPhotoHashesFailure: createAction('GET_PHOTO_HASHES_FAILURE', resolve => {
    return (threadId: string, error: Error) => resolve({ threadId, error })
  }),
  getPhotoMetadataSuccess: createAction('GET_PHOTO_METADATA_SUCCESS', resolve => {
    return (threadId: string, photoId: string, metadata: TextileTypes.PhotoMetadata) => resolve({ threadId, photoId, metadata })
  })
}

export type TextileNodeAction = ActionType<typeof actions>

export type PhotosQueryResult = {
  photo: TextileTypes.Photo,
  metadata?: TextileTypes.PhotoMetadata
}

export type ThreadData = {
  readonly querying: boolean
  readonly items: ReadonlyArray<PhotosQueryResult>
  readonly error?: Error
}

type ThreadMap = {
  readonly [key: string]: ThreadData
}

type TextileAppStateStatus = AppStateStatus | 'unknown'

type TextileNodeState = {
  readonly locked: boolean
  readonly appState: TextileAppStateStatus
  readonly online: boolean
  readonly nodeState: {
    readonly state?: 'creating' | 'stopped' | 'starting' | 'started' | 'stopping'
    readonly error?: Error
  }
  readonly threads: ThreadMap
}

export const initialState: TextileNodeState = {
  locked: false,
  appState: 'unknown',
  online: false,
  nodeState: {},
  threads: {},
}

export function reducer (state: TextileNodeState = initialState, action: TextileNodeAction): TextileNodeState {
  switch (action.type) {
    case getType(actions.lock):
      return { ...state, locked: action.payload.value }
    case getType(actions.appStateChange):
      return { ...state, appState: action.payload.newState }
    case getType(actions.createNodeRequest):
      return { ...state, nodeState: { ...state.nodeState, state: 'creating' } }
    case getType(actions.createNodeSuccess):
      return { ...state, nodeState: { ...state.nodeState, state: 'stopped' } }
    case getType(actions.startNodeRequest):
      return { ...state, nodeState: { ...state.nodeState, state: 'starting' } }
    case getType(actions.startNodeSuccess):
      return { ...state, nodeState: {...state.nodeState, state: 'started' } }
    case getType(actions.stopNodeRequest):
      return { ...state, nodeState: { ...state.nodeState, state: 'stopping' } }
    case getType(actions.stopNodeSuccess):
      return { ...state, nodeState: { ...state.nodeState, state: 'stopped' } }
    case getType(actions.createNodeFailure):
    case getType(actions.startNodeFailure):
    case getType(actions.stopNodeFailure):
      return { ...state, nodeState: { ...state.nodeState, error: action.payload.error } }
    case getType(actions.nodeOnline):
      return { ...state, online: true }
    case getType(actions.getPhotoHashesRequest): {
      const { threadId } = action.payload
      const threadData = state.threads[threadId] || createEmptyThreadData()
      const threads = { ...state.threads, [threadId]: { ...threadData, querying: true } }
      return { ...state, threads }
    }
    case getType(actions.getPhotoHashesSuccess): {
      // TODO: This isn't working?
      const { threadId, items } = action.payload
      const threadData = state.threads[threadId] || createEmptyThreadData()
      const threads = { ...state.threads, [threadId]: { ...threadData, querying: false, items: items } }
      return { ...state, threads }
    }
    case getType(actions.getPhotoHashesFailure): {
      const { threadId, error } = action.payload
      const threadData = state.threads[threadId] || createEmptyThreadData()
      const threads = { ...state.threads, [threadId]: { ...threadData, querying: false, error } }
      return { ...state, threads }
    }
    case getType(actions.getPhotoMetadataSuccess): {
      // TODO: This isn't working?
      const { threadId, photoId, metadata } = action.payload
      const threadData = state.threads[threadId]
      if (!threadData) return state
      const items = threadData.items
      if (!items) return state
      const target = items.find(itm => itm.photo.id === photoId)
      if (!target) return state
      target.metadata = metadata
      const threads = { ...state.threads, [threadId]: { ...threadData, querying: false, items: items.map(itm => {
            if (itm.photo.id !== photoId) {
              return itm
            } else {
              itm.metadata = metadata
              return itm
            }
      })}}
      return { ...state, threads }
    }
    default:
      return state
  }
}

function createEmptyThreadData (): ThreadData {
  return {
    querying: false,
    items: Array<PhotosQueryResult>()
  }
}

// TODO: create RootState type that will be passed into these
export const TextileNodeSelectors = {
  locked: (state: any) => (state.textileNode as TextileNodeState).locked,
  appState: (state: any) => (state.textileNode as TextileNodeState).appState,
  online: (state: any) => (state.textileNode as TextileNodeState).online,
  threads: (state: any) => (state.textileNode as TextileNodeState).threads,
  metadataById: (state: any, threadId: string, photoId: string) => {
    const threadData = (state.textileNode as TextileNodeState).threads[threadId]
    if (!threadData) return undefined
    const items = threadData.items
    if (!items) return undefined
    const target = items.find(itm => itm.photo.id === photoId)
    if (!target) return undefined
    return target.metadata
  },
  itemsByThreadId: (state: any, threadId: string) => {
    const threadData = (state.textileNode as TextileNodeState).threads[threadId]
    if (!threadData) return undefined
    return threadData.items
  }
}

export default actions
