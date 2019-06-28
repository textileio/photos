import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import * as actions from './actions'

export interface RenameGroupState {
  readonly [threadId: string]: {
    readonly error?: string
  }
}

export type RenameGroupAction = ActionType<typeof actions>

export default (state: RenameGroupState = {}, action: RenameGroupAction) => {
  switch (action.type) {
    case getType(actions.renameGroup.request): {
      return {
        ...state,
        [action.payload.threadId]: {}
      }
    }
    case getType(actions.renameGroup.success):
    case getType(actions.cancelRenameGroup): {
      const { [action.payload.threadId]: renamed, ...renameGroup } = state
      return renameGroup
    }
    case getType(actions.renameGroup.failure): {
      const { threadId, error } = action.payload
      const errorMessage =
        (error.message as string) || (error as string) || 'unknown'
      return {
        ...state,
        [threadId]: {
          error: errorMessage
        }
      }
    }
    default:
      return state
  }
}
