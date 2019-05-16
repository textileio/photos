import { createAsyncAction } from 'typesafe-actions'

export const addMessage = createAsyncAction(
  'group/add-message/ADD_MESSAGE_REQUEST',
  'group/add-message/ADD_MESSAGE_SUCCESS',
  'group/add-message/ADD_MESSAGE_FAILURE'
)<{ id: string, groupId: string, body: string }, { id: string, groupId: string }, { id: string, groupId: string, error: any }>()
