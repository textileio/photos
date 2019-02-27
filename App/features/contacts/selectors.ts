import { ContactsState } from './reducer'
import {
  SearchResultsSection,
  SearchResult,
  TextileSearchResult,
  AddressBookSearchResult
} from './models'

export const makeIsKnown = (id: string) => (state: ContactsState) => state.contacts.some((p) => p.id === id)

export const makeByThreadId = (id: string) => (state: ContactsState) => state.contacts.filter((contact) => (contact.thread_ids || []).indexOf(id) > -1)

export const makeContactById = (id: string) => (state: ContactsState) => state.contacts.find((contact) => contact.id === id)

export const searchResults = (state: ContactsState) => {
  const sections: SearchResultsSection[] = []

  let textileData: SearchResult[] | undefined
  if (state.textileSearchResults.error) {
    textileData = [{ key: 'textile_error', type: 'error', data: state.textileSearchResults.error }]
  } else if (state.textileSearchResults.results && state.textileSearchResults.results.length > 0) {
    textileData = state.textileSearchResults.results.map((result) => {
      const selector = makeIsKnown(result.id)
      const isContact = selector(state)
      const adding = Object.keys(state.addingContacts).indexOf(result.id) > -1
      const textileResult: TextileSearchResult = { key: result.id, type: 'textile', data: { contact: result, isContact, adding } }
      return textileResult
    })
  } else if (state.textileSearchResults.results && state.textileSearchResults.results.length === 0) {
    textileData = [{ key: 'textile_empty', type: 'empty' }]
  }

  if (state.textileSearchResults.processing) {
    textileData = [{ key: 'textile_loading', type: 'loading' }, ...textileData || []]
  }

  if (textileData) {
    sections.push({ key: 'textile', title: 'Textile Users', data: textileData })
  }

  let addressBookData: SearchResult[] | undefined
  if (state.addressBookSearchResults.processing) {
    addressBookData = [{ key: 'addressBook_loading', type: 'loading' }]
  } else if (state.addressBookSearchResults.error) {
    addressBookData = [{ key: 'addressBook_error', type: 'error', data: state.addressBookSearchResults.error }]
  } else if (state.addressBookSearchResults.results && state.addressBookSearchResults.results.length > 0) {
    addressBookData = state.addressBookSearchResults.results.map((result) => {
      const addressBookResult: AddressBookSearchResult = { key: result.recordID, type: 'addressBook', data: result }
      return addressBookResult
    })
  } else if (state.addressBookSearchResults.results && state.addressBookSearchResults.results.length === 0) {
    addressBookData = [{ key: 'addressBook_empty', type: 'empty' }]
  }
  if (addressBookData) {
    sections.push({ key: 'addressBook', title: 'Address Book', data: addressBookData })
  }

  return sections
}
