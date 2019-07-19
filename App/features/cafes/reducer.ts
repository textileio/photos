import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import * as actions from './actions'
import { CafeSessionsData, Cafes, Cafe } from './models'

export interface CafesState {
  readonly cafes: Cafes
  readonly cafeSessions: {
    readonly sessions: CafeSessionsData
    readonly processing: boolean
    readonly error?: string
  }
}

export type CafesAction = ActionType<typeof actions>

export default combineReducers<CafesState, CafesAction>({
  cafes: (state = {}, action) => {
    switch (action.type) {
      // Update our list of registered cafes with cafes that are actuall registered to
      // catch cafe data for cafes that were registered before we added this redux state
      case getType(actions.getCafeSessions.success): {
        const { sessions } = action.payload
        const cafes = sessions.reduce((cafes, session) => {
          const { peer } = session.cafe
          const updated: Cafe = {
            ...cafes[peer],
            peerId: peer,
            state: 'registered'
          }
          return {
            ...cafes,
            [peer]: updated
          }
        }, state)
        return cafes
      }
      case getType(actions.registerCafe.request): {
        const { peerId, token } = action.payload
        return {
          ...state,
          [peerId]: { peerId, token, state: 'registering' }
        }
      }
      case getType(actions.registerCafe.success): {
        const peerId = action.payload
        return { ...state, [peerId]: { ...state[peerId], state: 'registered' } }
      }
      case getType(actions.registerCafe.failure): {
        const { peerId, error } = action.payload
        const errorMessage =
          (error.message as string) || (error as string) || 'unknown error'
        return {
          ...state,
          [peerId]: {
            ...state[peerId],
            error: errorMessage
          }
        }
      }
      case getType(actions.deregisterCafe.request): {
        const { peerId } = action.payload
        return {
          ...state,
          [peerId]: { ...state[peerId], state: 'deregistering' }
        }
      }
      case getType(actions.deregisterCafe.success): {
        const { [action.payload]: deregistered, ...newState } = state
        return newState
      }
      case getType(actions.deregisterCafe.failure): {
        const { peerId, error } = action.payload
        const errorMessage =
          (error.message as string) || (error as string) || 'unknown'
        return {
          ...state,
          [peerId]: {
            ...state[peerId],
            error: errorMessage
          }
        }
      }
      default:
        return state
    }
  },
  cafeSessions: (state = { sessions: {}, processing: false }, action) => {
    switch (action.type) {
      case getType(actions.getCafeSessions.request): {
        return { ...state, processing: true, error: undefined }
      }
      case getType(actions.getCafeSessions.success): {
        const { sessions } = action.payload
        const cafeSessionsData = sessions.reduce(
          (cafeSessionsData, session) => {
            return {
              ...cafeSessionsData,
              [session.cafe.peer]: { session, processing: false }
            }
          },
          {} as CafeSessionsData
        )
        return { sessions: cafeSessionsData, processing: false }
      }
      case getType(actions.getCafeSessions.failure): {
        const { error } = action.payload
        const message =
          (error.message as string) || (error as string) || 'unknown error'
        return { ...state, error: message, processing: false }
      }
      case getType(actions.refreshCafeSession.request): {
        const { peerId } = action.payload
        return {
          ...state,
          sessions: {
            ...state.sessions,
            [peerId]: { ...state.sessions[peerId], processing: true }
          }
        }
      }
      case getType(actions.refreshCafeSession.success): {
        const { session } = action.payload
        const peerId = session.cafe.peer
        return {
          ...state,
          sessions: {
            ...state.sessions,
            [peerId]: { session, processing: false }
          }
        }
      }
      case getType(actions.refreshCafeSession.failure): {
        const { peerId, error } = action.payload
        const message =
          (error.message as string) || (error as string) || 'unknown error'
        return {
          ...state,
          sessions: {
            ...state.sessions,
            [peerId]: {
              ...state.sessions[peerId],
              processing: false,
              error: message
            }
          }
        }
      }
      default:
        return state
    }
  }
})
