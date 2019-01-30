import { createAction, ActionType, getType } from 'typesafe-actions'
import { SectionListData } from 'react-native'
import { ContactInfo } from '@textile/react-native-sdk'
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
  searchResultsTextile: createAction('@contacts/SEARCH_RESULTS_TEXTILE', (resolve) => {
    return (results: ReadonlyArray<ContactInfo>) => resolve({ results })
  }),
  searchResultsAddressBook: createAction('@contacts/SEARCH_RESULTS_ADDRESS_BOOK', (resolve) => {
    return (results: ReadonlyArray<Contacts.Contact>) => resolve({ results })
  }),
  searchErrorTextile: createAction('@contacts/SEARCH_ERROR_TEXTILE', (resolve) => {
    return (error: any) => resolve({ error })
  }),
  searchErrorAddressBook: createAction('@contacts/SEARCH_ERROR_ADDRESS_BOOK', (resolve) => {
    return (error: any) => resolve({ error })
  }),
  clearSearch: createAction('@contacts/CLEAR_SEARCH')
}

export type ContactsAction = ActionType<typeof actions>

export interface ContactsState {
  readonly contacts: ReadonlyArray<ContactInfo>
  readonly textileSearchResults: {
    readonly processing: boolean
    readonly results?: ReadonlyArray<ContactInfo>
    readonly error?: string
  }
  readonly addressBookSearchResults: {
    readonly processing: boolean
    readonly results?: ReadonlyArray<Contacts.Contact>
    readonly error?: string
  }
}

export const initialState: ContactsState = {
  contacts: [],
  textileSearchResults: {
    processing: false
  },
  addressBookSearchResults: {
    processing: false
  }
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
    case getType(actions.searchResultsTextile): {
      return {
        ...state,
        textileSearchResults: {
          processing: false,
          results: action.payload.results
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
    default:
      return state
  }
}

export interface TextileSearchResult {
  readonly type: 'textile'
  readonly data: ContactInfo
}

export interface AddressBookSearchResult {
  readonly type: 'addressBook'
  readonly data: Contacts.Contact
}

export interface ErrorSearchResult {
  readonly type: 'error'
  readonly data: string
}

export interface LoadingSearchResult {
  readonly type: 'loading'
}

export type SearchResult = TextileSearchResult | AddressBookSearchResult | ErrorSearchResult | LoadingSearchResult

export interface SearchResultsSection {
  readonly title: string
  readonly data: SearchResult[]
}

export const ContactsSelectors = {
  isKnown: (state: RootState, id: string) => state.contacts.contacts.some((p) => p.id === id),
  byThreadId: (state: RootState, id: string) => state.contacts.contacts.filter((contact) => (contact.thread_ids || []).indexOf(id) > -1),
  contactById: (state: RootState, id: string) => state.contacts.contacts.find((contact) => contact.id === id),
  searchResults: (state: RootState) => {
    const addressBookItems = state.contacts.addressBookSearchResults.results
    const sections: SearchResultsSection[] = []
    if (state.contacts.textileSearchResults.processing) {
      const data: LoadingSearchResult[] = [{ type: 'loading' }]
      sections.push({ title: 'Textile Users', data })
    } else if (state.contacts.textileSearchResults.error) {
      const data: ErrorSearchResult[] = [{ type: 'error', data: state.contacts.textileSearchResults.error }]
      sections.push({ title: 'Textile Users', data })
    } else if (state.contacts.textileSearchResults.results) {
      const data = state.contacts.textileSearchResults.results.map((result) => {
        const textileResult: TextileSearchResult = { type: 'textile', data: result }
        return textileResult
      })
      sections.push({ title: 'Textile Users', data })
    }

    if (state.contacts.addressBookSearchResults.processing) {
      const data: LoadingSearchResult[] = [{ type: 'loading' }]
      sections.push({ title: 'Address Book', data })
    } else if (state.contacts.addressBookSearchResults.error) {
      const data: ErrorSearchResult[] = [{ type: 'error', data: state.contacts.addressBookSearchResults.error }]
      sections.push({ title: 'Address Book', data })
    } else if (state.contacts.addressBookSearchResults.results) {
      const data = state.contacts.addressBookSearchResults.results.map((result) => {
        const addressBookResult: AddressBookSearchResult = { type: 'addressBook', data: result }
        return addressBookResult
      })
      sections.push({ title: 'Address Book', data })
    }

    return sections
  }
}

export default actions
