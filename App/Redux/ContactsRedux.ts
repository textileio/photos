import { createAction, ActionType, getType } from 'typesafe-actions'
import { ContactInfo, pb } from '@textile/react-native-sdk'
import Contacts from 'react-native-contacts'

import { RootState } from './Types'

const actions = {
  getContactsRequest: createAction('GET_CONTACTS_REQUEST'),
  getContactsSuccess: createAction('GET_CONTACT_SUCCESS', (resolve) => {
    return (contacts: ReadonlyArray<ContactInfo>) => resolve({contacts})
  }),
  searchRequest: createAction('@contacts/SEARCH_REQUEST', (resolve) => {
    return (searchString: string) => resolve({ searchString })
  }),
  searchStarted: createAction('@contacts/SEARCH_STARTED'),
  searchResultTextile: createAction('@contacts/SEARCH_RESULT_TEXTILE', (resolve) => {
    return (result: pb.IContact) => resolve({ result })
  }),
  textileSearchComplete: createAction('@contacts/TEXTILE_SEARCH_COMPLETE'),
  searchResultsAddressBook: createAction('@contacts/SEARCH_RESULTS_ADDRESS_BOOK', (resolve) => {
    return (results: ReadonlyArray<Contacts.Contact>) => resolve({ results })
  }),
  searchErrorTextile: createAction('@contacts/SEARCH_ERROR_TEXTILE', (resolve) => {
    return (error: any) => resolve({ error })
  }),
  searchErrorAddressBook: createAction('@contacts/SEARCH_ERROR_ADDRESS_BOOK', (resolve) => {
    return (error: any) => resolve({ error })
  }),
  clearSearch: createAction('@contacts/CLEAR_SEARCH'),
  addContactRequest: createAction('@contacts/ADD_CONTACT_REQUEST', (resolve) => {
    return (contact: pb.IContact) => resolve({ contact })
  }),
  addContactSuccess: createAction('@contacts/ADD_CONTACT_SUCCESS', (resolve) => {
    return (contact: pb.IContact) => resolve({ contact })
  }),
  addContactError: createAction('@contacts/ADD_CONTACT_ERROR', (resolve) => {
    return (contact: pb.IContact, error: any) => resolve({ contact, error })
  }),
  clearAddContact: createAction('@contacts/CLEAR_ADD_CONTACT_ERROR', (resolve) => {
    return (contact: pb.IContact) => resolve({ contact })
  }),
  authorInviteRequest: createAction('@contacts/AUTHOR_INVITE_REQUEST', (resolve) => {
    return (contact: Contacts.Contact) => resolve({ contact })
  })
}

export type ContactsAction = ActionType<typeof actions>

export interface AddingContact {
  readonly error?: string
}

export interface AddingContacts {
  readonly [key: string]: AddingContact
}

export interface ContactsState {
  readonly contacts: ReadonlyArray<ContactInfo>
  readonly textileSearchResults: {
    readonly processing: boolean
    readonly results?: ReadonlyArray<pb.IContact>
    readonly error?: string
  }
  readonly addressBookSearchResults: {
    readonly processing: boolean
    readonly results?: ReadonlyArray<Contacts.Contact>
    readonly error?: string
  }
  readonly addingContacts: AddingContacts
}

export const initialState: ContactsState = {
  contacts: [],
  textileSearchResults: {
    processing: false
  },
  addressBookSearchResults: {
    processing: false
  },
  addingContacts: {}
}

export function reducer (state: ContactsState = initialState, action: ContactsAction): ContactsState {
  switch (action.type) {
    case getType(actions.getContactsSuccess):
      return { ...state, contacts: action.payload.contacts }
    case getType(actions.searchRequest): {
      return {
        ...state,
        textileSearchResults: {
          processing: false
        },
        addressBookSearchResults: {
          processing: false
        }
      }
    }
    case getType(actions.searchStarted): {
      return {
        ...state,
        textileSearchResults: {
          processing: true
        },
        addressBookSearchResults: {
          processing: true
        }
      }
    }
    case getType(actions.searchResultTextile): {
      return {
        ...state,
        textileSearchResults: {
          ...state.textileSearchResults,
          results: [...state.textileSearchResults.results || [], action.payload.result]
        }
      }
    }
    case getType(actions.textileSearchComplete): {
      return {
        ...state,
        textileSearchResults: {
          ...state.textileSearchResults,
          processing: false
        }
      }
    }
    case getType(actions.searchResultsAddressBook): {
      return {
        ...state,
        addressBookSearchResults: {
          processing: false,
          results: action.payload.results
        }
      }
    }
    case getType(actions.searchErrorTextile): {
      const { error } = action.payload
      const message = error.message as string || error as string || 'unknown'
      return {
        ...state,
        textileSearchResults: {
          processing: false,
          error: message
        }
      }
    }
    case getType(actions.searchErrorAddressBook): {
      const { error } = action.payload
      const message = error.message as string || error as string || 'unknown'
      return {
        ...state,
        addressBookSearchResults: {
          processing: false,
          error: message
        }
      }
    }
    case getType(actions.clearSearch): {
      return {
        ...state,
        textileSearchResults: {
          processing: false
        },
        addressBookSearchResults: {
          processing: false
        }
      }
    }
    case getType(actions.addContactRequest): {
      return {
        ...state,
        addingContacts: {
          ...state.addingContacts,
          [action.payload.contact.id]: {}
        }
      }
    }
    case getType(actions.addContactSuccess):
    case getType(actions.clearAddContact): {
      const { [action.payload.contact.id]: removed, ...addingContacts } = state.addingContacts
      return {
        ...state,
        addingContacts
      }
    }
    case getType(actions.addContactError): {
      const { contact, error } = action.payload
      const message = error.message as string || error as string || 'unknown'
      return {
        ...state,
        addingContacts: {
          ...state.addingContacts,
          [contact.id]: {
            error: message
          }
        }
      }
    }
    default:
      return state
  }
}

export interface TextileSearchResult {
  readonly key: string
  readonly type: 'textile'
  readonly data: {
    contact: pb.IContact,
    isContact: boolean,
    adding: boolean
  }
}

export interface AddressBookSearchResult {
  readonly key: string
  readonly type: 'addressBook'
  readonly data: Contacts.Contact
}

export interface ErrorSearchResult {
  readonly key: string
  readonly type: 'error'
  readonly data: string
}

export interface LoadingSearchResult {
  readonly key: string
  readonly type: 'loading'
}

export interface EmptySearchResult {
  readonly key: string
  readonly type: 'empty'
}

export type SearchResult = TextileSearchResult | AddressBookSearchResult | ErrorSearchResult | LoadingSearchResult | EmptySearchResult

export interface SearchResultsSection {
  readonly key: string
  readonly title: string
  readonly data: SearchResult[]
}

export const ContactsSelectors = {
  isKnown: (state: RootState, id: string) => state.contacts.contacts.some((p) => p.id === id),
  byThreadId: (state: RootState, id: string) => state.contacts.contacts.filter((contact) => (contact.thread_ids || []).indexOf(id) > -1),
  contactById: (state: RootState, id: string) => state.contacts.contacts.find((contact) => contact.id === id),
  searchResults: (state: RootState) => {
    const sections: SearchResultsSection[] = []

    let textileData: SearchResult[] | undefined
    if (state.contacts.textileSearchResults.error) {
      textileData = [{ key: 'textile_error', type: 'error', data: state.contacts.textileSearchResults.error }]
    } else if (state.contacts.textileSearchResults.results && state.contacts.textileSearchResults.results.length > 0) {
      textileData = state.contacts.textileSearchResults.results.map((result) => {
        const isContact = ContactsSelectors.isKnown(state, result.id)
        const adding = Object.keys(state.contacts.addingContacts).indexOf(result.id) > -1
        const textileResult: TextileSearchResult = { key: result.id, type: 'textile', data: { contact: result, isContact, adding } }
        return textileResult
      })
    } else if (state.contacts.textileSearchResults.results && state.contacts.textileSearchResults.results.length === 0) {
      textileData = [{ key: 'textile_empty', type: 'empty' }]
    }

    if (state.contacts.textileSearchResults.processing) {
      textileData = [{ key: 'textile_loading', type: 'loading' }, ...textileData || []]
    }

    if (textileData) {
      sections.push({ key: 'textile', title: 'Textile Users', data: textileData })
    }

    let addressBookData: SearchResult[] | undefined
    if (state.contacts.addressBookSearchResults.processing) {
      addressBookData = [{ key: 'addressBook_loading', type: 'loading' }]
    } else if (state.contacts.addressBookSearchResults.error) {
      addressBookData = [{ key: 'addressBook_error', type: 'error', data: state.contacts.addressBookSearchResults.error }]
    } else if (state.contacts.addressBookSearchResults.results && state.contacts.addressBookSearchResults.results.length > 0) {
      addressBookData = state.contacts.addressBookSearchResults.results.map((result) => {
        const addressBookResult: AddressBookSearchResult = { key: result.recordID, type: 'addressBook', data: result }
        return addressBookResult
      })
    } else if (state.contacts.addressBookSearchResults.results && state.contacts.addressBookSearchResults.results.length === 0) {
      addressBookData = [{ key: 'addressBook_empty', type: 'empty' }]
    }
    if (addressBookData) {
      sections.push({ key: 'addressBook', title: 'Address Book', data: addressBookData })
    }

    return sections
  }
}

export default actions
