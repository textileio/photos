import { createAsyncAction, ActionType, getType } from 'typesafe-actions'
import { ThreadFeedItem } from '@textile/react-native-sdk'

export const actions = {
  refreshGroup: createAsyncAction(
    '@groups/REFRESH_GROUP_REQUEST',
    '@groups/REFRESH_GROUP_SUCCESS',
    '@groups/REFRESH_GROUP_FAILURE'
  )<{ id: string, limit?: number }, { id: string, items: ReadonlyArray<ThreadFeedItem> }, { id: string, error: any }>(),
  loadGroupItems: createAsyncAction(
    '@groups/LOAD_GROUP_ITEMS_REQUEST',
    '@groups/LOAD_GROUP_ITEMS_SUCCESS',
    '@groups/LOAD_GROUP_ITEMS_FAILURE'
  )<{ id: string, limit?: number }, { id: string, items: ReadonlyArray<ThreadFeedItem> }, { id: string, error: any}>()
}

export type GroupsAction = ActionType<typeof actions>

export interface GroupData {
  readonly loading: boolean
  readonly items: ReadonlyArray<ThreadFeedItem>
  readonly error?: string
}

export interface Groups {
  readonly [key: string]: GroupData | undefined
}

export interface GroupsState {
  readonly groups: Groups
}

export const initialState: GroupsState = {
  groups: {}
}

export function reducer(state: GroupsState = initialState, action: GroupsAction): GroupsState {
  switch (action.type) {
    case getType(actions.refreshGroup.request):
    case getType(actions.loadGroupItems.request): {
      const { id } = action.payload
      const prev = state.groups[id]
      return { ...state, groups: { ...state.groups, [id]: { ...(prev || { items: [] }), loading: true, error: undefined } } }
    }
    case getType(actions.refreshGroup.success): {
      const { id, items } = action.payload
      return { ...state, groups: { ...state.groups, [id]: { items, loading: false } } }
    }
    case getType(actions.loadGroupItems.success): {
      const { id, items } = action.payload
      const prev = state.groups[id]
      const prevItems = prev ? prev.items : []
      return { ...state, groups: { ...state.groups, [id]: { items: [...prevItems, ...items], loading: false } } }
    }
    case getType(actions.refreshGroup.failure):
    case getType(actions.loadGroupItems.failure): {
      const { id, error } = action.payload
      const message = error.message as string || error as string || 'unknown'
      const prev = state.groups[id]
      return { ...state, groups: { ...state.groups, [id]: { ...(prev || { items: [] }), loading: false, error: message } } }
    }
    default:
      return state
  }
}

export default actions
