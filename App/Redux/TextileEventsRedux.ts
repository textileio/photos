import { createAction, getType, ActionType } from 'typesafe-actions'
import { RootState } from './Types'

export enum NodeState {
  stopped = 'stopped',
  started = 'started',
  online = 'online'
}

const actions = {
  failedToInitializeNode: createAction('FAILED_TO_INITIALIZE_NODE', resolve => {
    return (error: any) => resolve({ error })
  }),
  nodeStarted: createAction('NODE_STARTED'),
  nodeStopped: createAction('NODE_STOPPED'),
  nodeOnline: createAction('NODE_ONLINE'),
  nodeFailedToStart: createAction('NODE_FAILED_TO_START', resolve => {
    return (error: string) => resolve({ error })
  }),
  nodeFailedToStop: createAction('NODE_FAILED_TO_STOP', resolve => {
    return (error: string) => resolve({ error })
  }),
  stopNodeAfterDelayStarting: createAction(
    '@bridge/stopNodeAfterDelayStarting',
    resolve => (delay: number) => resolve({ delay })
  ),
  stopNodeAfterDelayCancelled: createAction(
    '@bridge/stopNodeAfterDelayCancelled',
    resolve => () => resolve()
  ),
  newErrorMessage: createAction(
    '@bridge/NEW_ERROR_MESSAGE',
    resolve => (type: string, message: string) => resolve({ type, message })
  ),
  refreshMessagesRequest: createAction('@bridge/REFRESH_MESSAGES', resolve => {
    return () => resolve()
  }),
  ignoreFileRequest: createAction(
    '@bridge/IGNORE_FILE_REQUEST',
    resolve => (blockId: string) => resolve({ blockId })
  )
}

export type TextileEventsAction = ActionType<typeof actions>

interface TextileEventsState {
  readonly nodeState: {
    readonly state: NodeState
    readonly error?: string
  }
}

export const initialState: TextileEventsState = {
  nodeState: {
    state: NodeState.stopped
  }
}

export function reducer(
  state: TextileEventsState = initialState,
  action: TextileEventsAction
): TextileEventsState {
  switch (action.type) {
    case getType(actions.failedToInitializeNode): {
      const { error } = action.payload
      const message =
        (error.message as string) || (error as string) || 'unknown error'
      return { ...state, nodeState: { ...state.nodeState, error: message } }
    }
    case getType(actions.nodeStarted):
      return { ...state, nodeState: { state: NodeState.started } }
    case getType(actions.nodeStopped):
      return { ...state, nodeState: { state: NodeState.stopped } }
    case getType(actions.nodeOnline):
      return { ...state, nodeState: { state: NodeState.online } }
    case getType(actions.nodeFailedToStart):
    case getType(actions.nodeFailedToStop): {
      const { error } = action.payload
      return { ...state, nodeState: { ...state.nodeState, error } }
    }
    default:
      return state
  }
}

export const TextileEventsSelectors = {
  nodeState: (state: RootState) => state.textile.nodeState,
  started: (state: RootState) =>
    state.textile.nodeState.state === NodeState.started ||
    state.textile.nodeState.state === NodeState.online,
  online: (state: RootState) =>
    state.textile.nodeState.state === NodeState.online
}

export default actions
