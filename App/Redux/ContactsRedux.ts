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
    return (id: string, error: Error) => resolve({ id, error })
  }),
  updateContactsComplete: createAction('UPDATE_CONTACTS_COMPLETE', resolve => {
    return () => resolve()
  })
}

export type ContactsAction = ActionType<typeof actions>

export type ContactsState = {
  readonly profiles: ReadonlyArray<TextileTypes.Profile>,
  readonly pending: ReadonlyArray<TextileTypes.PendingProfile>
}

export const initialState: ContactsState = {
  profiles: [],
  pending: []
}

export function reducer (state: ContactsState = initialState, action: ContactsAction): ContactsState {
  switch (action.type) {
    case getType(actions.newContactRequest):
      const {id} = action.payload
      const updatedPending = state.pending.filter((p) => p.id !== id )
      return { ...state, pending: [...updatedPending, {id, attempts: 3}] }
    case getType(actions.newContactSuccess):
      const profile = action.payload.profile
      const profiles = state.profiles.filter((c) => c.id !== profile.id)
      const filteredPending = state.pending.filter(p=>p.id!==profile.id)
      return { profiles: [...profiles, profile], pending: filteredPending }
    case getType(actions.newContactFailure):
      const profile_id = action.payload.id

      // if we already have a successful one, let's just remove it
      if (state.profiles.find((c) => c.id !== profile_id)) {
        return {...state, pending: state.pending.filter((c) => c.id !== profile_id) }
      }

      // if we have remaining attampts, allow them to happen
      const existing = state.pending.find((c) => c.id === profile_id)
      if (existing && existing.attempts - 1 > 0)  {
        const pending = state.pending.filter((c) => c.id !== profile_id)
        const updated = {id: existing.id, attempts: existing.attempts - 1}
        return {...state, pending: [...pending, updated] }
      }

      // just remove it, we're out of tries
      return { ...state, pending: state.pending.filter((p) => p.id !== profile_id) }
    default:
      return state
  }
}

export const ContactsSelectors = {
  pending: (state) => state.contacts.pending.map((p) => p.id),
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
