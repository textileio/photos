import { createAction, getType, ActionType } from 'typesafe-actions'
import { NodeState } from '@textile/react-native-sdk'

const actions = {
  newNodeState: createAction('@bridge/NEW_NODE_STATE', (resolve) => {
    return (state: NodeState) => resolve({ state })
  }),
  appStateChange: createAction(
    '@bridge/APP_STATE_CHANGE',
    (resolve) => (previousState: string, newState: string) => resolve({ previousState, newState })
  ),
  newErrorMessage: createAction(
    '@bridge/NEW_ERROR_MESSAGE',
    (resolve) => (error: string) => resolve({ error })
  ),
  startNodeFinished: createAction(
    '@bridge/startNodeFinished',
    (resolve) => () => resolve()
  ),
  stopNodeAfterDelayStarting: createAction(
    '@bridge/stopNodeAfterDelayStarting',
    (resolve) => () => resolve()
  ),
  stopNodeAfterDelayCancelled: createAction(
    '@bridge/stopNodeAfterDelayCancelled',
    (resolve) => () => resolve()
  ),
  stopNodeAfterDelayFinishing: createAction(
    '@bridge/stopNodeAfterDelayFinishing',
    (resolve) => () => resolve()
  ),
  stopNodeAfterDelayComplete: createAction(
    '@bridge/stopNodeAfterDelayComplete',
    (resolve) => () => resolve()
  ),
  nodeOnline: createAction('@bridge/NODE_ONLINE', (resolve) => {
    return () => resolve()
  }),
  refreshMessagesRequest: createAction('@bridge/REFRESH_MESSAGES', (resolve) => {
    return () => resolve()
  }),
  updateProfile: createAction('@bridge/UPDATE_PROFILE', (resolve) => {
    return () => resolve()
  }),
  ignoreFileRequest: createAction(
    '@bridge/IGNORE_FILE_REQUEST',
    (resolve) => (blockId: string) => resolve({ blockId })
  )
}

export type TextileEventsActions = ActionType<typeof actions>

interface TextileEventsState {
  readonly nodeState: {
    readonly state: NodeState
    readonly error?: string
  }
  readonly online: boolean
}

export const initialState: TextileEventsState = {
  nodeState: {
    state: NodeState.nonexistent
  },
  online: false
}

export function reducer (state: TextileEventsState = initialState, action: TextileEventsActions): TextileEventsState {
  switch (action.type) {
    case getType(actions.newNodeState):
      return { ...state, nodeState: {state: action.payload.state }}
    case getType(actions.nodeOnline):
      return { ...state, online: true }
    default:
      return state
  }
}
export default actions
