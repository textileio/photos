import { createAsyncAction } from 'typesafe-actions'

export interface addMessagePayload {
  id: string
  groupId: string
}

export interface addMessageRequestPayload extends addMessagePayload {
  body: string
}

export interface addMessageFailurePayload extends addMessagePayload {
  error: any
}

export const addMessage = createAsyncAction(
  'group/add-message/ADD_MESSAGE_REQUEST',
  'group/add-message/ADD_MESSAGE_SUCCESS',
  'group/add-message/ADD_MESSAGE_FAILURE'
)<addMessageRequestPayload, addMessagePayload, addMessageFailurePayload>()
