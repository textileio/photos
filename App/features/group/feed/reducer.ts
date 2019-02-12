import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import { Groups } from './models'
import * as actions from './actions'

export interface FeedState {
  readonly groups: Groups
}

export const initialState: FeedState = {
  groups: {}
}

export type FeedAction = ActionType<typeof actions>

export default combineReducers<FeedState, FeedAction>({
  groups: (state = {}, action) => {
    switch (action.type) {
      case getType(actions.refreshFeed.request):
      case getType(actions.loadFeedItems.request): {
        const { id } = action.payload
        const prev = state[id]
        return { ...state, [id]: { ...(prev || { items: [] }), loading: true, error: undefined } }
      }
      case getType(actions.refreshFeed.success): {
        const { id, items } = action.payload
        return { ...state, [id]: { items, loading: false } }
      }
      case getType(actions.loadFeedItems.success): {
        const { id, items } = action.payload
        const prev = state[id]
        const prevItems = prev ? prev.items : []
        return { ...state, [id]: { items: [...prevItems, ...items], loading: false } }
      }
      case getType(actions.refreshFeed.failure):
      case getType(actions.loadFeedItems.failure): {
        const { id, error } = action.payload
        const message = error.message as string || error as string || 'unknown'
        const prev = state[id]
        return { ...state, [id]: { ...(prev || { items: [] }), loading: false, error: message } }
      }
      default:
        return state
    }
  }
})
