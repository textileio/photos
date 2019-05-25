import { createAction, createAsyncAction } from 'typesafe-actions'

export const begin = createAction('file-sync/BEGIN', resolve => {
  return (group: string, id: string) => resolve({ group, id })
})

export const uploadProgress = createAction(
  'file-sync/UPLOAD_PROGRESS',
  resolve => {
    return (id: string, progress: number) => resolve({ id, progress })
  }
)

export const uploadComplete = createAction(
  'file-sync/UPLOAD_COMPLETE',
  resolve => {
    return (id: string, responseCode: string, responseBody: string) =>
      resolve({ id, responseCode, responseBody })
  }
)

export const error = createAction('file-sync/ERROR', resolve => {
  return (id: string, error: string) => resolve({ id, error })
})
