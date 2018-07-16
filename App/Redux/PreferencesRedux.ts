import { createAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  onboardedSuccess: createAction('ONBOARDED_SUCCESS', resolve => {
    return () => resolve()
  }),
  toggleVerboseUi: createAction('TOGGLE_VERBOSE_UI', resolve => {
    return () => resolve()
  })
}

export type PreferencesAction = ActionType<typeof actions>

export type PreferencesState = {
  onboarded: boolean
  verboseUi: boolean
}

export const initialState: PreferencesState = {
  onboarded: false,
  verboseUi: false
}

export function reducer (state: PreferencesState = initialState, action: PreferencesAction): PreferencesState {
  switch (action.type) {
    case getType(actions.onboardedSuccess):
      return { ...state, onboarded: true }
    case getType(actions.toggleVerboseUi):
      return { ...state, verboseUi: !state.verboseUi }
    default:
      return state
  }
}

export const PreferencesSelectors = {
  // TODO: Need typed state
  onboarded: (state: any) => state.preferences.onboarded
}

export default actions
