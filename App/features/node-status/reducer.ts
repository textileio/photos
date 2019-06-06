import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import * as actions from './actions'
import { NodeState } from './models'

export interface NodeStatusState {
  readonly state: NodeState
  readonly error?: string
}

export type NodeStatusAction = ActionType<typeof actions>

export default combineReducers<NodeStatusState, NodeStatusAction>({
  state: (state = NodeState.stopped, action) => {
    switch (action.type) {
      case getType(actions.nodeStarted):
        return NodeState.started
      case getType(actions.nodeStopped):
        return NodeState.stopped
      case getType(actions.nodeOnline):
        return NodeState.online
      default:
        return state
    }
  },
  error: (state = undefined, action) => {
    switch (action.type) {
      case getType(actions.nodeFailedToStart):
      case getType(actions.nodeFailedToStop): {
        const { error } = action.payload
        return error
      }
      case getType(actions.failedToInitializeNode): {
        const { error } = action.payload
        const message =
          (error.message as string) || (error as string) || 'unknown error'
        return message
      }
      default:
        return state
    }
  }
})
