import { createAction, ActionType, getType } from 'typesafe-actions'

import { RootState } from './Types'

const actions = {
  startup: createAction('STARTUP', (resolve) => {
    return () => resolve()
  })
}

export type StartupAction = ActionType<typeof actions>

export interface StartupState {
  started: boolean
}

const initialState: StartupState = {
  started: false
}

export const startupSelectors = {
  started: (state: RootState) => state.startup.started
}

export function reducer(state: StartupState = initialState, action: StartupAction): StartupState {
  switch (action.type) {
    case getType(actions.startup): {
      return { ...state, started: true }
    }
    default:
      return state
  }
}

export default actions
