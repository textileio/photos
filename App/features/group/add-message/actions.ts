import { createAsyncAction } from 'typesafe-actions'

export interface AddMessagePayload {
  id: string
  groupId: string
}

export interface AddMessageRequestPayload extends AddMessagePayload {
  body: string
}

export interface AddMessageFailurePayload extends AddMessagePayload {
  error: any
}

export const addMessage = createAsyncAction(
  'group/add-message/ADD_MESSAGE_REQUEST',
  'group/add-message/ADD_MESSAGE_SUCCESS',
  'group/add-message/ADD_MESSAGE_FAILURE'
)<AddMessageRequestPayload, AddMessagePayload, AddMessageFailurePayload>()
