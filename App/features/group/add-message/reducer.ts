import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import { Groups, Messages } from './models'
import * as actions from './actions'

export interface AddMessageState {
  groups: Groups
}

export type AddMessageAction = ActionType<typeof actions>

export default combineReducers<AddMessageState, AddMessageAction>({
  groups: (state = {}, action) => {
    switch (action.type) {
      case getType(actions.addMessage.request): {
        const { id, groupId, body } = action.payload
        const groupMessages = state[groupId] || {}
        const updatedGroupMessages: Messages = { ...groupMessages, [id]: { body } }
        return { ...state, [groupId]: updatedGroupMessages }
      }
      case getType(actions.addMessage.success): {
        const { id, groupId } = action.payload
        const groupMessages = state[groupId] || {}
        const { [id]: removed, ...rest } = groupMessages
        return { ...state, [groupId]: rest }
      }
      case getType(actions.addMessage.failure): {
        const { id, groupId, error } = action.payload
        const errorMessage = error.message as string || error as string || 'unknown error'
        const groupMessages = state[groupId] || {}
        const message = groupMessages[id]
        const updatedGroupMessages: Messages = { ...groupMessages, [id]: { ...message, error: errorMessage } }
        return { ...state, [groupId]: updatedGroupMessages }
      }
      default:
        return state
    }
  }
})
