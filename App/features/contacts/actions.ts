import { createAction } from 'typesafe-actions'
import { IContact } from '@textile/react-native-sdk'
import Contacts from 'react-native-contacts'

export const getContactsRequest = createAction('GET_CONTACTS_REQUEST')

export const getContactsSuccess = createAction('GET_CONTACT_SUCCESS', (resolve) => {
  return (contacts: ReadonlyArray<IContact>) => resolve({ contacts })
})

export const searchRequest = createAction('@contacts/SEARCH_REQUEST', (resolve) => {
  return (searchString: string) => resolve({ searchString })
})

export const searchStarted = createAction('@contacts/SEARCH_STARTED')

export const searchResultTextile = createAction('@contacts/SEARCH_RESULT_TEXTILE', (resolve) => {
  return (result: IContact) => resolve({ result })
})

export const textileSearchComplete = createAction('@contacts/TEXTILE_SEARCH_COMPLETE')

export const searchResultsAddressBook = createAction('@contacts/SEARCH_RESULTS_ADDRESS_BOOK', (resolve) => {
  return (results: ReadonlyArray<Contacts.Contact>) => resolve({ results })
})

export const searchErrorTextile = createAction('@contacts/SEARCH_ERROR_TEXTILE', (resolve) => {
  return (error: any) => resolve({ error })
})

export const searchErrorAddressBook = createAction('@contacts/SEARCH_ERROR_ADDRESS_BOOK', (resolve) => {
  return (error: any) => resolve({ error })
})

export const clearSearch = createAction('@contacts/CLEAR_SEARCH')

export const addContactRequest = createAction('@contacts/ADD_CONTACT_REQUEST', (resolve) => {
  return (contact: IContact) => resolve({ contact })
})

export const addContactSuccess = createAction('@contacts/ADD_CONTACT_SUCCESS', (resolve) => {
  return (contact: IContact) => resolve({ contact })
})

export const addContactError = createAction('@contacts/ADD_CONTACT_ERROR', (resolve) => {
  return (contact: IContact, error: any) => resolve({ contact, error })
})

export const clearAddContact = createAction('@contacts/CLEAR_ADD_CONTACT_ERROR', (resolve) => {
  return (contact: IContact) => resolve({ contact })
})

export const removeContactRequest = createAction('@contacts/REMOVE_CONTACT_REQUEST', (resolve) => {
  return (address: string) => resolve({ address })
})

export const removeContactSuccess = createAction('@contacts/REMOVE_CONTACT_SUCCESS', (resolve) => {
  return (address: string) => resolve ({ address })
})

export const authorInviteRequest = createAction('@contacts/AUTHOR_INVITE_REQUEST', (resolve) => {
  return (contact: Contacts.Contact) => resolve({ contact })
})
