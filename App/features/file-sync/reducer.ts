import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'
import { ICafeSyncGroupStatus } from '@textile/react-native-sdk'

import * as actions from './actions'

export interface FileSyncState {
  groups: {
    [groupId: string]: ICafeSyncGroupStatus
  }
}

export type FileSyncAction = ActionType<typeof actions>

export default combineReducers<FileSyncState, FileSyncAction>({
  groups: (state = {}, action) => {
    switch (action.type) {
      case getType(actions.syncUpdate):
      case getType(actions.syncFailed): {
        const { status } = action.payload
        return { ...state, [status.id] : status }
      }
      case getType(actions.syncComplete): {
        const { [action.payload.status.id]: complete, ...remaining } = state
        return remaining
      }
      case getType(actions.clearStatus): {
        const { [action.payload.groupId]: cleared, ...remaining } = state
          return remaining
      }
      default:
        return state
    }
  }
})

