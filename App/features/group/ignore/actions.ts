import { createAsyncAction } from 'typesafe-actions'

export const ignore = createAsyncAction(
  'group/ignore/IGNORE_REQUEST',
  'group/ignore/IGNORE_SUCCESS',
  'group/ignore/IGNORE_FAILURE'
)<
  string,
  string,
  {
    blockId: string
    error: any
  }
>()
