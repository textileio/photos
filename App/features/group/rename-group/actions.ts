import { createAsyncAction } from 'typesafe-actions'

export const renameGroup = createAsyncAction(
  'group/rename-group/RENAME_GROUP_REQUEST',
  'group/rename-group/RENAME_GROUP_SUCCESS',
  'group/rename-group/RENAME_GROUP_FAILURE'
)<{ threadId: string, name: string }, { threadId: string }, { threadId: string, error: any }>()
