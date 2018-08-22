import { createAction, ActionType, getType } from 'typesafe-actions'
import { RootState } from '../Redux/Types'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  getContactsSuccess: createAction('GET_CONTACT_SUCCESS', resolve => {
    return (contacts: TextileTypes.Contact[]) => resolve({contacts})
  }),
  getUsernameSuccess: createAction('GET_USERNAME_SUCCESS', resolve => {
    return (contact: TextileTypes.Contact, username: string) => resolve({contact, username})
  })
}

export type ContactsAction = ActionType<typeof actions>

export type ContactsState = {
  readonly contacts: ReadonlyArray<TextileTypes.Contact>
}

export const initialState: ContactsState = {
  contacts: []
}

export function reducer (state: ContactsState = initialState, action: ContactsAction): ContactsState {
  switch (action.type) {
    case getType(actions.getUsernameSuccess): {
      const contacts = state.contacts.map((c) => {
        if (c.id === action.payload.contact.id) {
          c.username = action.payload.username
        }
        return c
      })
      return { ...state, contacts }
    }
    case getType(actions.getContactsSuccess):
      const contacts = action.payload.contacts.map(contact => {
        const existing = state.contacts
          .filter((c) => c.username !== undefined)
          .find((c) => c.id === contact.id)
        if (existing) {
          contact.username = existing.username
        }
        return contact
      })
      return { ...state, contacts }
    default:
      return state
  }
}

export const ContactsSelectors = {
  isKnown: (state: RootState, id: string) => {
    return state.contacts && state.contacts.contacts && state.contacts.contacts.some((p) => p.id === id)
  }
}

export default actions
