import { createAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  onboardedSuccess: createAction('ONBOARDED_SUCCESS', resolve => {
    return () => resolve()
  }),
  toggleVerboseUi: createAction('TOGGLE_VERBOSE_UI', resolve => {
    return () => resolve()
  }),
  updatecMnemonic: createAction('UPDATE_MNEMONIC', resolve => {
    return (mnemonic: string) => resolve({ mnemonic })
  })
}

export type PreferencesAction = ActionType<typeof actions>

export type PreferencesState = {
  onboarded: boolean
  verboseUi: boolean
  mnemonic?: string
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
    case getType(actions.updatecMnemonic):
      return { ...state, mnemonic: action.payload.mnemonic }
    default:
      return state
  }
}

export const PreferencesSelectors = {
  // TODO: Need typed state
  onboarded: (state: any) => state.preferences.onboarded
}

export default actions
