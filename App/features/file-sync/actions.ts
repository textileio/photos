import { createAction } from 'typesafe-actions'
import { ICafeSyncGroupStatus } from '@textile/js-types';

export const syncUpdate = createAction('file-sync/SYNC_UPDATE', resolve => {
  return (status: ICafeSyncGroupStatus) => resolve({ status })
})

export const syncComplete = createAction(
  'file-sync/SYNC_COMPLETE',
  resolve => {
    return (status: ICafeSyncGroupStatus) => resolve({ status })
  }
)

export const syncFailed = createAction('file-sync/SYNC_FAILED', resolve => {
  return (status: ICafeSyncGroupStatus) => resolve({ status })
})

export const clearStatus = createAction('file-sync/CLEAR_STATUS', resolve => {
  return (groupId: string) => resolve({ groupId })
})
