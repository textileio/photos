import { createAction, ActionType, getType } from 'typesafe-actions'
import { RootState } from './Types'
import { Contact, PeerId } from '../Models/TextileTypes'

const actions = {
  getContactsSuccess: createAction('GET_CONTACT_SUCCESS', (resolve) => {
    return (contacts: Contact[]) => resolve({contacts})
  }),
  getUsernameSuccess: createAction('GET_USERNAME_SUCCESS', (resolve) => {
    return (contact: Contact, username: string) => resolve({contact, username})
  })
}

export type ContactsAction = ActionType<typeof actions>

export interface ContactsState {
  readonly contacts: ReadonlyArray<Contact>
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

      // Bandaid until we put username responsibility into Go
      const keepers = state.contacts
        .filter((c) => c.username !== undefined)
        .reduce((map, obj) => {
          map[obj.id] = obj
          return map
        }, {} as {[index: string]: Contact})

      const contacts = action.payload.contacts.map((c) => {
        c.username = keepers[c.id] ? keepers[c.id].username : undefined
        return c
      })
      return { ...state, contacts }
    default:
      return state
  }
}

export const ContactsSelectors = {
  isKnown: (state: RootState, id: PeerId) => state.contacts.contacts.some((p) => p.id === id)
}

export default actions
