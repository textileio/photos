import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import { DiscoveredCafes } from '../../Services/textile-lb-api'

import * as actions from './actions'

export interface RegisterCafes {
  readonly [url: string]: {
    readonly error?: string
  }
}

export interface DeregisterCafes {
  readonly [id: string]: {
    readonly error?: string
  }
}

export interface CafesState {
  readonly recommendedCafesResults: {
    readonly processing: boolean
    readonly results?: DiscoveredCafes
    readonly error?: string
  }
  readonly registerCafe: RegisterCafes
  readonly deregisterCafe: DeregisterCafes
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
  },
  registerCafe: (state = {}, action) => {
    switch (action.type) {
      case getType(actions.registerCafe.request): {
        const { url } = action.payload
        return {
          ...state,
          [url]: {}
        }
      }
      case getType(actions.registerCafe.success): {
        const url = action.payload
        const { [url]: registered, ...newState } = state
        return newState
      }
      case getType(actions.registerCafe.failure): {
        const { url, error } = action.payload
        const errorMessage =
          (error.message as string) || (error as string) || 'unknown'
        return {
          ...state,
          [url]: {
            error: errorMessage
          }
        }
      }
      default:
        return state
    }
  },
  deregisterCafe: (state = {}, action) => {
    switch (action.type) {
      case getType(actions.deregisterCafe.request): {
        return {
          ...state,
          [action.payload]: {}
        }
      }
      case getType(actions.deregisterCafe.success): {
        const { [action.payload]: deregistered, ...newState } = state
        return newState
      }
      case getType(actions.deregisterCafe.failure): {
        const { id, error } = action.payload
        const errorMessage =
          (error.message as string) || (error as string) || 'unknown'
        return {
          ...state,
          [id]: {
            error: errorMessage
          }
        }
      }
      default:
        return state
    }
  }
})
