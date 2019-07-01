import { FileSyncState } from './reducer'

export const makeStatusForId = (id: string) => (state: FileSyncState) => {
  if (Object.keys(state.groups).indexOf(id) > -1) {
    return state.groups[id]
  } else {
    return undefined
  }
}
