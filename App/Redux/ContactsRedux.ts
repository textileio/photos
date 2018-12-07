import { createAction, ActionType, getType } from 'typesafe-actions'
import { RootState } from './Types'
import { ContactInfo, ThreadInfo } from '../NativeModules/Textile'

const actions = {
  getContactsRequest: createAction('GET_CONTACTS_REQUEST'),
  getContactsSuccess: createAction('GET_CONTACT_SUCCESS', (resolve) => {
    return (contacts: ReadonlyArray<ContactInfo>) => resolve({contacts})
  }),
  getContactThreadsRequest: createAction('GET_CONTACT_THREADS_REQUEST', (resolve) => {
    return (id: string) => resolve({id})
  }),
  getContactThreadsSuccess: createAction('GET_CONTACT_THREADS_SUCCESS', (resolve) => {
    return (id: string, threads: ReadonlyArray<ThreadInfo>) => resolve({id, threads})
  })
}

export type ContactsAction = ActionType<typeof actions>

export interface ContactsState {
  readonly contacts: ReadonlyArray<ContactInfo>
  readonly contactThreads: {[key: string]: ReadonlyArray<ThreadInfo>}
}

export const initialState: ContactsState = {
  contacts: [],
  contactThreads: {}
}

export function reducer (state: ContactsState = initialState, action: ContactsAction): ContactsState {
  switch (action.type) {
    case getType(actions.getContactsSuccess): {
      return { ...state, contacts: action.payload.contacts }
    }
    case getType(actions.getContactThreadsSuccess): {
      const {id, threads} = action.payload
      return { ...state, contactThreads: {[id]: threads, ...state.contactThreads} }
    }
    default:
      return state
  }
}

export const ContactsSelectors = {
  getContactThreads: (state: RootState, id: string) => state.contacts.contactThreads[id] || [],
  isKnown: (state: RootState, id: string) => state.contacts.contacts.some((p) => p.id === id)
}

export default actions
