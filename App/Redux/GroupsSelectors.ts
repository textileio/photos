import { RootState } from './Types'

export function offsetForGroup(state: RootState, groupId: string) {
  const groupData = state.groups.groups[groupId]
  if (!groupData || groupData.items.length === 0) {
    return
  }
  const last = groupData.items[groupData.items.length - 1]
  return last.block
}
