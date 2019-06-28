import { FileSyncState } from './reducer'

export const makeStatusForId = (id: string) => (state: FileSyncState) => {
  return state.groups[id]
}
