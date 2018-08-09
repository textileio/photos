import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  newContactSuccess: createAction('NEW_CONTACT_SUCCESS', resolve => {
    return (profile: TextileTypes.Profile) => resolve({profile})
  })
}

export type ContactsAction = ActionType<typeof actions>

export type ContactsState = {
  readonly profiles: ReadonlyArray<TextileTypes.Profile>
}

export const initialState: ContactsState = {
  profiles: []
}

export function reducer (state: ContactsState = initialState, action: ContactsAction): ContactsState {
  switch (action.type) {
    case getType(actions.newContactSuccess):
      console.log(action.payload)
      const profile = action.payload.profile
      const profiles = state.profiles.filter((c) => c.id !== profile.id)
      return { ...state, profiles: [...profiles, profile] }
    default:
      return state
  }
}

export const ContactsSelectors = {
  isKnown: (state, id: string) => {
    return state.contacts && state.contacts.profiles && state.contacts.profiles.some((p) => p.id === id)
  }
}

export default actions
