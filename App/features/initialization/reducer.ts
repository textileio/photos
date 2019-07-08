import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import { TextileInstanceState } from './models'
import * as actions from './actions'

// When the path changes, currentPage should be reset to 0
export interface InitializationState {
  readonly onboarding: {
    completed: boolean
    path: string
    currentPage: number
  }
  readonly instance: {
    readonly state: TextileInstanceState
    readonly error?: string
  }
}

export type InitializationAction = ActionType<typeof actions>

export default combineReducers<InitializationState, InitializationAction>({
  onboarding: (
    state = {
      completed: false,
      path: 'default',
      currentPage: 0
    },
    action
  ) => {
    switch (action.type) {
      case getType(actions.chooseOnboardingPath): {
        return {
          ...state,
          path: action.payload.path,
          currentPage: 0
        }
      }
      case getType(actions.nextPage): {
        return {
          ...state,
          currentPage: state.currentPage + 1
        }
      }
      case getType(actions.setCurrentPage): {
        return {
          ...state,
          currentPage: action.payload.page
        }
      }
      case getType(actions.onboardingSuccess): {
        return {
          ...state,
          completed: true
        }
      }
      default:
        return state
    }
  },
  instance: (
    state = {
      state: TextileInstanceState.uninitialized
    },
    action
  ) => {
    switch (action.type) {
      case getType(actions.initializeNewAccount):
      case getType(actions.initializeExistingAccount): {
        return {
          state: TextileInstanceState.initializing
        }
      }
      case getType(actions.failedToInitializeNode): {
        const { error } = action.payload
        const message =
          (error.message as string) || (error as string) || 'unknown error'
        return {
          state: TextileInstanceState.uninitialized,
          error: message
        }
      }
      case getType(actions.nodeInitialized): {
        return {
          state: TextileInstanceState.initialized
        }
      }
      default:
        return state
    }
  }
})
