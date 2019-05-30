import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'
import { IContact } from '@textile/react-native-sdk'
import Contacts from 'react-native-contacts'

import * as actions from './actions'
import { AddingContacts, RemovingContacts } from './models'

export interface ContactsState {
  readonly contacts: ReadonlyArray<IContact>
  readonly textileSearchResults: {
    readonly processing: boolean
    readonly results?: ReadonlyArray<IContact>
    readonly error?: string
  }
  readonly addressBookSearchResults: {
    readonly processing: boolean
    readonly results?: ReadonlyArray<Contacts.Contact>
    readonly error?: string
  }
  readonly addingContacts: AddingContacts
  readonly removingContacts: RemovingContacts
}

export type ContactsAction = ActionType<typeof actions>

export default combineReducers<ContactsState, ContactsAction>({
  contacts: (state = [], action) => {
    switch (action.type) {
      case getType(actions.getContactsSuccess):
        return action.payload.contacts
      default:
        return state
    }
  },
  textileSearchResults: (state = { processing: false }, action) => {
    switch (action.type) {
      case getType(actions.searchRequest): {
        return {
          processing: false
        }
      }
      case getType(actions.searchStarted): {
        return {
          processing: true
        }
      }
      case getType(actions.searchResultTextile): {
        return {
          ...state,
          results: [...state.results || [], action.payload.result]
        }
      }
      case getType(actions.textileSearchComplete): {
        return {
          ...state,
          processing: false
        }
      }
      case getType(actions.searchErrorTextile): {
        const { error } = action.payload
        const message = error.message as string || error as string || 'unknown'
        return {
          ...state,
          processing: false,
          error: message
        }
      }
      case getType(actions.clearSearch): {
        return {
            processing: false
          }
      }
      default:
        return state
    }
  },
  addressBookSearchResults: (state = { processing: false }, action) => {
    switch (action.type) {
      case getType(actions.searchRequest): {
        return {
          processing: false
        }
      }
      case getType(actions.searchStarted): {
        return {
          processing: true
        }
      }
      case getType(actions.searchResultsAddressBook): {
        return {
          ...state,
          processing: false,
          results: action.payload.results
        }
      }
      case getType(actions.searchErrorAddressBook): {
        const { error } = action.payload
        const message = error.message as string || error as string || 'unknown'
        return {
          processing: false,
          error: message
        }
      }
      case getType(actions.clearSearch): {
        return {
            processing: false
          }
      }
      default:
        return state
    }
  },
  addingContacts: (state = {}, action) => {
    switch (action.type) {
      case getType(actions.addContactRequest): {
        return {
          ...state,
          [action.payload.contact.address]: {}
        }
      }
      case getType(actions.addContactSuccess):
      case getType(actions.clearAddContact): {
        const { [action.payload.contact.address]: removed, ...addingContacts } = state
        return addingContacts
      }
      case getType(actions.addContactError): {
        const { contact, error } = action.payload
        const message = error.message as string || error as string || 'unknown'
        return {
          ...state,
          [contact.address]: {
            error: message
          }
        }
      }
      default:
        return state
    }
  },
  removingContacts: (state = {}, action) => {
    switch (action.type) {
      case getType(actions.removeContact.request): {
        return {
          ...state,
          [action.payload]: {}
        }
      }
      case getType(actions.removeContact.success): {
        const { [action.payload]: removed, ...removingContacts } = state
        return removingContacts
      }
      case getType(actions.removeContact.failure): {
        const { address, error } = action.payload
        const errorMessage = error.message as string || error as string || 'unknown'
        return {
          ...state,
          [address]: {
            error: errorMessage
          }
        }
      }
      default:
        return state
    }
  }
})
