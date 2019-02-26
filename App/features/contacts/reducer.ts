import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'
import { ContactInfo, pb } from '@textile/react-native-sdk'
import Contacts from 'react-native-contacts'

import * as actions from './actions'
import { AddingContacts } from './models'

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
          [action.payload.contact.id]: {}
        }
      }
      case getType(actions.addContactSuccess):
      case getType(actions.clearAddContact): {
        const { [action.payload.contact.id]: removed, ...addingContacts } = state
        return {
          addingContacts
        }
      }
      case getType(actions.addContactError): {
        const { contact, error } = action.payload
        const message = error.message as string || error as string || 'unknown'
        return {
          ...state,
          [contact.id]: {
            error: message
          }
        }
      }
      default:
        return state
    }
  }
})
