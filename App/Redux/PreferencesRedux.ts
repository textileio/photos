import { createAction, ActionType, getType } from 'typesafe-actions'
import TextileTypes from '../Models/TextileTypes'

const actions = {
  onboardedSuccess: createAction('ONBOARDED_SUCCESS', resolve => {
    return () => resolve()
  }),
  toggleVerboseUi: createAction('TOGGLE_VERBOSE_UI', resolve => {
    return () => resolve()
  }),
  updatecMnemonic: createAction('UPDATE_MNEMONIC', resolve => {
    return (mnemonic: string) => resolve({ mnemonic })
  }),
  getProfileSuccess: createAction('GET_AVATAR_SUCCESS', resolve => {
    return (profile: TextileTypes.Profile) => resolve({ profile })
  }),
  pendingAvatar: createAction('PENDING_AVATAR_REQUEST', resolve => {
    return (avatarId: string) => resolve({avatarId})
  }),
  getPublicKeySuccess: createAction('GET_PUBLIC_KEY_SUCCESS', resolve => {
    return (publicKey: string) => resolve({ publicKey })
  }),
}

export type PreferencesAction = ActionType<typeof actions>

export type PreferencesState = {
  onboarded: boolean
  verboseUi: boolean
  mnemonic?: string
  publicKey?: string
  profile?: TextileTypes.Profile
  pending?: string
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
    case getType(actions.getProfileSuccess):
      return { ...state, profile: action.payload.profile, pending: undefined}
    case getType(actions.pendingAvatar):
      return { ...state, pending: action.payload.avatarId }
    case getType(actions.getPublicKeySuccess):
      return { ...state, publicKey: action.payload.publicKey }
    default:
      return state
  }
}

export const PreferencesSelectors = {
  // TODO: Need typed state
  onboarded: (state: any) => state.preferences.onboarded,
  pending: (state: any) => state.preferences.pending,
  profile: (state: any) => state.preferences.profile
}

export default actions
