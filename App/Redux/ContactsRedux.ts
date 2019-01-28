import { createAction, ActionType, getType } from 'typesafe-actions'
import { RootState } from './Types'
import { ContactInfo } from '@textile/react-native-sdk'

const actions = {
  getContactsRequest: createAction('GET_CONTACTS_REQUEST'),
  getContactsSuccess: createAction('GET_CONTACT_SUCCESS', (resolve) => {
    return (contacts: ReadonlyArray<ContactInfo>) => resolve({contacts})
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
    case getType(actions.getContactsSuccess):
      return { ...state, contacts: action.payload.contacts }
    default:
      return state
  }
}

export const ContactsSelectors = {
  isKnown: (state: RootState, id: string) => state.contacts.contacts.some((p) => p.id === id),
  byThreadId: (state: RootState, id: string) => state.contacts.contacts.filter((contact) => (contact.thread_ids || []).indexOf(id) > -1),
  contactById: (state: RootState, id: string) => state.contacts.contacts.find((contact) => contact.id === id)
}

export default actions
