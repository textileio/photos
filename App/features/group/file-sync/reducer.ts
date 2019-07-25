import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'
import { ICafeSyncGroupStatus } from '@textile/react-native-sdk'

import * as actions from './actions'
import { GroupStatus } from './models'

export interface FileSyncState {
  groups: {
    [groupId: string]: GroupStatus
  }
}

export type FileSyncAction = ActionType<typeof actions>

export default combineReducers<FileSyncState, FileSyncAction>({
  groups: (state = {}, action) => {
    switch (action.type) {
      case getType(actions.syncUpdate): {
        const {
          groupId,
          numberComplete,
          numberTotal,
          sizeComplete,
          sizeTotal
        } = action.payload
        return {
          ...state,
          [groupId]: { numberComplete, numberTotal, sizeComplete, sizeTotal }
        }
      }
      case getType(actions.syncFailed): {
        const { groupId, errorId, reason } = action.payload
        const previous = state[groupId]
        return {
          ...state,
          [groupId]: { ...previous, error: { id: errorId, reason } }
        }
      }
      case getType(actions.syncComplete): {
        const { groupId } = action.payload
        const { [groupId]: complete, ...remaining } = state
        return remaining
      }
      case getType(actions.clearStatus): {
        const { groupId } = action.payload
        const { [groupId]: cleared, ...remaining } = state
        return remaining
      }
      default:
        return state
    }
  }
})
