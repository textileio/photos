import { createAsyncAction, createAction } from 'typesafe-actions'

export const renameGroup = createAsyncAction(
  'group/rename-group/RENAME_GROUP_REQUEST',
  'group/rename-group/RENAME_GROUP_SUCCESS',
  'group/rename-group/RENAME_GROUP_FAILURE'
)<{ threadId: string, name: string }, { threadId: string }, { threadId: string, error: any }>()

export const cancelRenameGroup = createAction('group/rename-group/RENAME_GROUP_CANCEL', (resolve) => {
  return (threadId: string) => resolve({ threadId })
})
