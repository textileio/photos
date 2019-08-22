import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'
import * as actions from './actions'
import { Notification, LocalAlert } from './models'
import { Alert } from 'react-native'

export interface UpdatesState {
  readonly notifications: {
    readonly results: ReadonlyArray<Notification>
    readonly refreshing: boolean
  }
  readonly alerts: {
    readonly results: ReadonlyArray<LocalAlert>
  }
}

export const initialState: UpdatesState = {
  notifications: {
    results: [],
    refreshing: false
  },
  alerts: {
    results: []
  }
}

export type UpdatesAction = ActionType<typeof actions>

export default combineReducers<UpdatesState, UpdatesAction>({
  notifications: (state = { results: [], refreshing: false }, action) => {
    switch (action.type) {
      case getType(actions.refreshNotificationsStart):
        return { ...state, refreshing: true }
      case getType(actions.refreshNotificationsSuccess): {
        // Add it to our list for display
        const { results } = action.payload
        return { ...state, results, refreshing: false }
      }
      case getType(actions.refreshNotificationsFailure):
        return { ...state, refreshing: false }
      case getType(actions.newNotificationRequest): {
        // Useful so that new notifications you receive while staring at the Feed will just pop in
        const results = state.results.slice(0, 99)
        results.unshift(action.payload.notification)
        return { ...state, results }
      }
      default:
        return state
    }
  },
  alerts: (state = { results: [] }, action) => {
    switch (action.type) {
      case getType(actions.insertAlert): {
        const { type, weight } = action.payload
        if (state.results.find(alert => alert.type === type)) {
          return state
        } else {
          return {
            ...state,
            results: [
              ...state.results,
              {
                type,
                weight
              }
            ]
          }
        }
      }
      case getType(actions.removeAlert): {
        const results = state.results.filter(result => {
          return result.type !== action.payload.type
        })
        return { ...state, results }
      }
      default:
        return state
    }
  }
})
