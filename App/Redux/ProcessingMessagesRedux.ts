import { createAsyncAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  addMessage: createAsyncAction(
    '@groups/ADD_MESSAGE_REQUEST',
    '@groups/ADD_MESSAGE_SUCCESS',
    '@groups/ADD_MESSAGE_FAILURE'
  )<{ id: string, groupId: string, body: string }, { id: string, groupId: string }, { id: string, groupId: string, error: any }>()
}

export type ProcessingMessagesAction = ActionType<typeof actions>

export interface Message {
  readonly body: string
  readonly error?: string
}

export interface Messages {
  readonly [key: string]: Message
}

export interface Groups {
  readonly [key: string]: Messages | undefined
}

export interface ProcessingMessagesState {
  readonly groups: Groups
}

const initialState: ProcessingMessagesState = {
  groups: {}
}

export function reducer(state: ProcessingMessagesState = initialState, action: ProcessingMessagesAction): ProcessingMessagesState {
  switch (action.type) {
    case getType(actions.addMessage.request): {
      const { id, groupId, body } = action.payload
      const groupMessages = state.groups[groupId] || {}
      const updatedGroupMessages: Messages = { ...groupMessages, [id]: { body } }
      return { ...state, groups: { ...state.groups, [groupId]: updatedGroupMessages } }
    }
    case getType(actions.addMessage.success): {
      const { id, groupId } = action.payload
      const groupMessages = state.groups[groupId] || {}
      const { [id]: removed, ...rest } = groupMessages
      return { ...state, groups: { ...state.groups, [groupId]: rest } }
    }
    case getType(actions.addMessage.failure): {
      const { id, groupId, error } = action.payload
      const errorMessage = error.message as string || error as string || 'unknown error'
      const groupMessages = state.groups[groupId] || {}
      const message = groupMessages[id]
      const updatedGroupMessages: Messages = { ...groupMessages, [id]: { ...message, error: errorMessage } }
      return { ...state, groups: { ...state.groups, [groupId]: updatedGroupMessages } }
    }
    default:
      return state
  }
}

export default actions
