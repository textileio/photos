import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import { DiscoveredCafes } from '../../Services/textile-lb-api'

import * as actions from './actions'

export interface CafesState {
  readonly recommendedCafesResults: {
    readonly processing: boolean
    readonly results?: DiscoveredCafes
    readonly error?: string
  }
}

export type CafesAction = ActionType<typeof actions>

export default combineReducers<CafesState, CafesAction>({
  recommendedCafesResults: (state = { processing: false }, action) => {
    switch (action.type) {
      case getType(actions.getRecommendedCafes.request): {
        return {
          processing: true
        }
      }
      case getType(actions.getRecommendedCafes.success): {
        return {
          results: action.payload,
          processing: false
        }
      }
      case getType(actions.getRecommendedCafes.failure): {
        const error = action.payload
        const message =
          (error.message as string) || (error as string) || 'unknown'
        return {
          error: message,
          processing: false
        }
      }
      default:
        return state
    }
  }
})
