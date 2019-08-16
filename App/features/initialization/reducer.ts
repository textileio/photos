import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'

import { InitializationStatus, InitializationPath } from './models'
import * as actions from './actions'

export interface InitializationState {
  readonly onboarding: {
    readonly initializationPath?: InitializationPath
  }
  readonly instance: {
    readonly state: InitializationStatus
    readonly error?: string
  }
}

export type InitializationAction = ActionType<typeof actions>

export default combineReducers<InitializationState, InitializationAction>({
  onboarding: (state = {}, action) => {
    switch (action.type) {
      case getType(actions.chooseInitializationPath): {
        return {
          ...state,
          initializationPath: action.payload.path
        }
      }
      default:
        return state
    }
  },
  instance: (
    state = {
      state: 'uninitialized'
    },
    action
  ) => {
    switch (action.type) {
      case getType(actions.initializeNewAccount):
      case getType(actions.initializeExistingAccount): {
        return {
          state: 'creatingWallet'
        }
      }
      case getType(actions.failedToInitializeNode): {
        const { error } = action.payload
        const message =
          (error.message as string) || (error as string) || 'unknown error'
        return {
          state: 'uninitialized',
          error: message
        }
      }
      case getType(actions.updateInitializationStatus): {
        return {
          state: action.payload.status
        }
      }
      default:
        return state
    }
  }
})
