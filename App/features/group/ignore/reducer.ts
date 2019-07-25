import { ActionType, getType } from 'typesafe-actions'

import * as actions from './actions'

export interface IgnoreState {
  readonly [blockId: string]: {
    readonly error?: string
  }
}

export type IgnoreAction = ActionType<typeof actions>

export default (state: IgnoreState = {}, action: IgnoreAction) => {
  switch (action.type) {
    case getType(actions.ignore.request): {
      return {
        ...state,
        [action.payload]: {}
      }
    }
    case getType(actions.ignore.success): {
      const { [action.payload]: ignored, ...ignoreState } = state
      return ignoreState
    }
    case getType(actions.ignore.failure): {
      const { blockId, error } = action.payload
      const errorMessage =
        (error.message as string) || (error as string) || 'unknown'
      return {
        ...state,
        [blockId]: {
          error: errorMessage
        }
      }
    }
    default:
      return state
  }
}
