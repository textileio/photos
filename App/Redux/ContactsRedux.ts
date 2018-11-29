import { createAction, ActionType, getType } from 'typesafe-actions'
import { RootState } from './Types'
import { ContactInfo } from '../NativeModules/Textile'

// TODO: Update this and sagas to use new Contacts API

const actions = {
  getContactsSuccess: createAction('GET_CONTACT_SUCCESS', (resolve) => {
    return (contacts: ReadonlyArray<ContactInfo>) => resolve({contacts})
  }),
  getUsernameSuccess: createAction('GET_USERNAME_SUCCESS', (resolve) => {
    return (contact: ContactInfo, username: string) => resolve({contact, username})
  })
}

export type ContactsAction = ActionType<typeof actions>

export interface ContactsState {
  readonly contacts: ReadonlyArray<ContactInfo>
}

export const initialState: ContactsState = {
  contacts: []
}

export function reducer (state: ContactsState = initialState, action: ContactsAction): ContactsState {
  switch (action.type) {
    case getType(actions.getUsernameSuccess): {
      const contacts = state.contacts.map((c) => {
        if (c.id === action.payload.contact.id) {
          return { ...c, username: action.payload.username }
        } else {
          return c
        }
      })
      return { ...state, contacts }
    }
    case getType(actions.getContactsSuccess):

      // TODO: Bandaid until we put username responsibility into Go
      const keepers = state.contacts
        .filter((c) => c.username !== undefined)
        .reduce((map, obj) => {
          map[obj.id] = obj
          return map
        }, {} as {[index: string]: ContactInfo})

      const contacts = action.payload.contacts.map((c) => {
        return { ...c, username: keepers[c.id].username }
      })
      return { ...state, contacts }
    default:
      return state
  }
}

export const ContactsSelectors = {
  isKnown: (state: RootState, id: string) => state.contacts.contacts.some((p) => p.id === id)
}

export default actions
