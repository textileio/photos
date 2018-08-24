import { createAction, ActionType, getType } from 'typesafe-actions'
import { AppStateStatus } from 'react-native'
import * as TextileTypes from '../Models/TextileTypes'
import {RootState} from './Types'

const actions = {
  appStateChange: createAction('APP_STATE_CHANGE', resolve => {
    return (previousState: TextileAppStateStatus, newState: AppStateStatus) => resolve({ previousState, newState })
  }),
  creatingNode: createAction('CREATING_NODE'),
  createNodeSuccess: createAction('CREATE_NODE_SUCCESS'),
  startingNode: createAction('STARTING_NODE'),
  startNodeSuccess: createAction('START_NODE_SUCCESS', resolve => {
    return () => resolve()
  }),
  stoppingNode: createAction('STOP_NODE_REQUEST'),
  stopNodeSuccess: createAction('STOP_NODE_SUCCESS', resolve => {
    return () => resolve()
  }),
  nodeError: createAction('NODE_ERROR', resolve => {
    return (error: any) => resolve({ error })
  }),
  nodeOnline: createAction('NODE_ONLINE', resolve => {
    return () => resolve()
  }),
  ignorePhotoRequest: createAction('IGNORE_PHOTO_REQUEST', resolve => {
    return (threadId: string, blockId: string) => resolve({ threadId, blockId })
  }),
  getPhotoHashesRequest: createAction('GET_PHOTO_HASHES_REQUEST', resolve => {
    return (threadId: string) => resolve({ threadId })
  }),
  getPhotoHashesSuccess: createAction('GET_PHOTO_HASHES_SUCCESS', resolve => {
    return (threadId: string, photos: TextileTypes.Photo[]) => resolve({ threadId, photos })
  }),
  getPhotoHashesFailure: createAction('GET_PHOTO_HASHES_FAILURE', resolve => {
    return (threadId: string, error: Error) => resolve({ threadId, error })
  }),
  getPhotoMetadataSuccess: createAction('GET_PHOTO_METADATA_SUCCESS', resolve => {
    return (threadId: string, photoId: string, metadata: TextileTypes.PhotoMetadata) => resolve({ threadId, photoId, metadata })
  }),
  refreshMessagesRequest: createAction('REFRESH_MESSAGES_REQUEST', resolve => {
    return () => resolve()
  }),
  refreshMessagesSubmitted: createAction('REFRESH_MESSAGES_SUBMITTED', resolve => {
    return () => resolve()
  }),
  refreshMessagesSuccess: createAction('REFRESH_MESSAGES_SUCCESS', resolve => {
    return (timestamp: number) => resolve({ timestamp })
  }),
  refreshMessagesFailure: createAction('REFRESH_MESSAGES_FAILURE', resolve => {
    return (error: Error) => resolve({ error })
  })
}

export type TextileNodeAction = ActionType<typeof actions>

export type ThreadData = {
  readonly querying: boolean
  readonly photos: ReadonlyArray<TextileTypes.Photo>
  readonly error?: Error
}

type ThreadMap = {
  readonly [key: string]: ThreadData
}

type TextileAppStateStatus = AppStateStatus | 'unknown'

export enum NodeState {
  'nonexistent' = 'nonexistent',
  'creating' = 'creating',
  'created' = 'created', // Node has been created, on it's way to starting
  'starting' = 'starting',
  'started' = 'started',
  'stopping' = 'stopping',
  'stopped' = 'stopped' // Node has been explicitly stopped, different than created
}

type TextileNodeState = {
  readonly appState: TextileAppStateStatus
  readonly online: boolean
  readonly nodeState: {
    readonly state: NodeState
    readonly error?: string
  }
  readonly threads: ThreadMap,
  readonly refreshingMessages: boolean
}

export const initialState: TextileNodeState = {
  appState: 'unknown',
  online: false,
  nodeState: {
    state: NodeState.nonexistent
  },
  threads: {},
  refreshingMessages: false
}

export function reducer (state: TextileNodeState = initialState, action: TextileNodeAction): TextileNodeState {
  switch (action.type) {
    case getType(actions.appStateChange):
      return { ...state, appState: action.payload.newState }
    case getType(actions.creatingNode):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.creating } }
    case getType(actions.createNodeSuccess):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.created } }
    case getType(actions.startingNode):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.starting } }
    case getType(actions.startNodeSuccess):
      return { ...state, nodeState: {...state.nodeState, state: NodeState.started } }
    case getType(actions.stoppingNode):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.stopping } }
    case getType(actions.stopNodeSuccess):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.stopped } }
    case getType(actions.nodeError):
      const { error } = action.payload
      const errorMessage = (error.message as string) || (error as string) || 'unknown'
      return { ...state, nodeState: { ...state.nodeState, error: errorMessage } }
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
      const { threadId, photos } = action.payload
      const threadData = state.threads[threadId] || createEmptyThreadData()
      const threads = { ...state.threads, [threadId]: { ...threadData, querying: false, photos: photos } }
      return { ...state, threads }
    }
    case getType(actions.getPhotoHashesFailure): {
      const { threadId, error } = action.payload
      const threadData = state.threads[threadId] || createEmptyThreadData()
      const threads = { ...state.threads, [threadId]: { ...threadData, querying: false, error } }
      return { ...state, threads }
    }
    case getType(actions.refreshMessagesSubmitted):
      return { ...state, refreshingMessages: true }
    case getType(actions.refreshMessagesSuccess):
    case getType(actions.refreshMessagesFailure):
      return { ...state, refreshingMessages: false }
    default:
      return state
  }
}

function createEmptyThreadData (): ThreadData {
  return {
    querying: false,
    photos: Array<TextileTypes.Photo>()
  }
}

// TODO: create RootState type that will be passed into these
export const TextileNodeSelectors = {
  locked: (state: RootState) => state.textileNode.locked,
  appState: (state: RootState) => state.textileNode.appState,
  nodeState: (state: RootState) => state.textileNode.nodeState.state,
  online: (state: RootState) => state.textileNode.online,
  threads: (state: RootState) => state.textileNode.threads,
  photosByThreadId: (state: any, threadId: string) => {
    const threadData = state.textileNode.threads[threadId]
    if (!threadData) return undefined
    return threadData.photos
  },
  refreshingMessages: (state: RootState) => state.textileNode.refreshingMessages,
}

export default actions
