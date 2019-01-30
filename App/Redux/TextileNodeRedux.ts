import { createAction, ActionType, getType } from 'typesafe-actions'
import { AppStateStatus } from 'react-native'
import { RootState } from './Types'
import { NodeState } from '../Models/TextileTypes'

const actions = {
  // appStateChange: createAction('APP_STATE_CHANGE', (resolve) => {
  //   return (previousState: TextileAppStateStatus, newState: TextileAppStateStatus) => resolve({ previousState, newState })
  // }),
  creatingWallet: createAction('CREATING_WALLET'),
  derivingAccount: createAction('DERIVING_ACCOUNT'),
  initializingRepo: createAction('INITIALIZING_REPO'),
  createNodeRequest: createAction('CREATE_NODE_REQUEST'),
  creatingNode: createAction('CREATING_NODE'),
  createNodeSuccess: createAction('CREATE_NODE_SUCCESS'),
  startupComplete: createAction('REDUX_STARTUP_COMPLETE', (resolve) => {
    return () => resolve()
  }),
  startingNode: createAction('STARTING_NODE'),
  startNodeSuccess: createAction('START_NODE_SUCCESS', (resolve) => {
    return () => resolve()
  }),
  stoppingNode: createAction('STOP_NODE_REQUEST'),
  stopNodeSuccess: createAction('STOP_NODE_SUCCESS', (resolve) => {
    return () => resolve()
  }),
  nodeError: createAction('NODE_ERROR', (resolve) => {
    return (error: any) => resolve({ error })
  }),
  nodeOnline: createAction('NODE_ONLINE', (resolve) => {
    return () => resolve()
  }),
  ignoreFileRequest: createAction('IGNORE_FILE_REQUEST', (resolve) => {
    return (blockId: string) => resolve({ blockId })
  }),
  ignoreFileSuccess: createAction('IGNORE_FILE_SUCCESS', (resolve) => {
    return () => resolve()
  }),
  ignoreFileError: createAction('IGNORE_FILE_ERROR', (resolve) => {
    return (error: any) => resolve({ error })
  }),
  refreshMessagesRequest: createAction('REFRESH_MESSAGES_REQUEST', (resolve) => {
    return () => resolve()
  }),
  refreshMessagesSuccess: createAction('REFRESH_MESSAGES_SUCCESS', (resolve) => {
    return (timestamp: number) => resolve({ timestamp })
  }),
  refreshMessagesFailure: createAction('REFRESH_MESSAGES_FAILURE', (resolve) => {
    return (error: Error) => resolve({ error })
  })
}

export type TextileNodeAction = ActionType<typeof actions>

export type TextileAppStateStatus = AppStateStatus | 'unknown' | 'backgroundFromForeground'

interface TextileNodeState {
  // readonly appState: TextileAppStateStatus
  // readonly appStateUpdate: string
  readonly online: boolean
  readonly nodeState: {
    readonly state: NodeState
    readonly error?: string
  }
  readonly refreshingMessages: boolean
  readonly reduxReady: boolean
}

function getHMS() {
  const now = new Date()
  return [
    now.getHours().toString(),
    now.getMinutes().toString(),
    now.getSeconds().toString()
  ].join(':')
}
export const initialState: TextileNodeState = {
  // appState: 'unknown',
  // appStateUpdate: getHMS(),
  online: false,
  nodeState: {
    state: NodeState.nonexistent
  },
  reduxReady: false,
  refreshingMessages: false
}

export function reducer (state: TextileNodeState = initialState, action: TextileNodeAction): TextileNodeState {
  switch (action.type) {
    case getType(actions.startupComplete): {
      return { ...state, reduxReady: true }
    }
    // case getType(actions.appStateChange):
    //   return { ...state, appState: action.payload.newState, appStateUpdate: getHMS() }
    case getType(actions.creatingWallet):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.creatingWallet } }
    case getType(actions.derivingAccount):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.derivingAccount } }
    case getType(actions.initializingRepo):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.initializingRepo } }
    case getType(actions.creatingNode):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.creating } }
    case getType(actions.createNodeSuccess):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.created } }
    case getType(actions.startingNode):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.starting } }
    case getType(actions.startNodeSuccess):
      return { ...state, nodeState: {...state.nodeState, state: NodeState.started, error: undefined } }
    case getType(actions.stoppingNode):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.stopping } }
    case getType(actions.stopNodeSuccess):
      return { ...state, nodeState: { ...state.nodeState, state: NodeState.stopped } }
    case getType(actions.nodeError): {
      const { error } = action.payload
      const errorMessage = (error.message as string) || (error as string) || 'unknown'
      return { ...state, nodeState: { ...state.nodeState, error: errorMessage } }
    }
    case getType(actions.nodeOnline):
      return { ...state, online: true }
    case getType(actions.refreshMessagesRequest):
      return { ...state, refreshingMessages: true }
    case getType(actions.refreshMessagesSuccess):
    case getType(actions.refreshMessagesFailure):
      return { ...state, refreshingMessages: false }
    default:
      return state
  }
}

export const TextileNodeSelectors = {
  reduxStartupComplete: (state: RootState) => state.textileNode.reduxReady,
  // appState: (state: RootState) => state.textileNode.appState,
  nodeState: (state: RootState) => state.textileNode.nodeState.state,
  online: (state: RootState) => state.textileNode.online,
  refreshingMessages: (state: RootState) => state.textileNode.refreshingMessages
}

export default actions
