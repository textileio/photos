import { createAction } from 'typesafe-actions'

export const syncUpdate = createAction('group/file-sync/SYNC_UPDATE', resolve => {
  return (groupId: string, numberComplete: number, numberTotal: number, sizeComplete: number, sizeTotal: number) => resolve({ groupId, numberComplete, numberTotal, sizeComplete, sizeTotal })
})

export const syncComplete = createAction('group/file-sync/SYNC_COMPLETE', resolve => {
  return (groupId: string) => resolve({ groupId })
})

export const syncFailed = createAction('group/file-sync/SYNC_FAILED', resolve => {
  return (groupId: string, errorId: string, reason: string) => resolve({ groupId, errorId, reason })
})

export const clearStatus = createAction('group/file-sync/CLEAR_STATUS', resolve => {
  return (groupId: string) => resolve({ groupId })
})
