import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  newContactRequest: createAction('NEW_CONTACT_REQUEST', resolve => {
    return (id: string) => resolve({id})
  }),
  newContactSuccess: createAction('NEW_CONTACT_SUCCESS', resolve => {
    return (profile: TextileTypes.Profile) => resolve({profile})
  }),
  newContactFailure: createAction('NEW_CONTACT_FAILURE', resolve => {
    return (error: Error) => resolve({ error })
  })
}

export type ContactsAction = ActionType<typeof actions>

export type ContactsState = {
  readonly profiles: ReadonlyArray<TextileTypes.Profile>,
  readonly pending: ReadonlyArray<string>
}

export const initialState: ContactsState = {
  profiles: [],
  pending: []
}

export function reducer (state: ContactsState = initialState, action: ContactsAction): ContactsState {
  switch (action.type) {
    case getType(actions.newContactRequest):
      const {id} = action.payload
      const updatedPending = state.pending.filter((p) => p !== id )
      return { ...state, pending: [...updatedPending, id] }
    case getType(actions.newContactSuccess):
      const {profile} = action.payload
      const profiles = state.profiles.filter((c) => c.id !== profile.id)
      const filteredPending = state.pending.filter(p=>p!==profile.id)
      return { profiles: [...profiles, profile], pending: filteredPending }
    default:
      return state
  }
}

export const ContactsSelectors = {
  isKnown: (state, id: string) => {
    return state.contacts && state.contacts.profiles && state.contacts.profiles.some((p) => p.id === id)
  },
  getAll: (state) => {
    return state.contacts
  },
  contactById: (state, id: string) => {
    if (!state.contacts.profiles || state.contacts.profiles.length === 0) {
      return undefined
    }
    return state.contacts.profiles.find((p) => p.id === id)
  }
}

export default actions
