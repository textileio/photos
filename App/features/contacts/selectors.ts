import { ContactsState } from './reducer'
import {
  SearchResultsSection,
  SearchResult,
  TextileSearchResult,
  AddressBookSearchResult
} from './models'

export const makeIsKnown = (address: string) => (state: ContactsState) => state.contacts.some((p) => p.address === address)

export const makeByThreadId = (id: string) => (state: ContactsState) => state.contacts.filter((contact) => (contact.threads || []).indexOf(id) > -1)

export const makeContactByAddress = (address: string) => (state: ContactsState) => state.contacts.find((contact) => contact.address === address)

export const orderedContacts = (state: ContactsState) => {
  return state.contacts.slice().sort((a, b) => {
    const aExists: boolean = a.name !== undefined && a.name !== ''
    const bExists: boolean = b.name !== undefined && b.name !== ''

    let aSortKey = a.name
    let bSortKey = b.name

    if (aExists && !bExists) {
      // move b later if no name
      return -1
    } else if (!aExists && bExists) {
      // move a later if no name
      return 1
    } else if (!aExists && !bExists) {
      // if neither have name, use address and continue
      aSortKey = a.address
      bSortKey = b.address
    }

    aSortKey = aSortKey.toLowerCase()
    bSortKey = bSortKey.toLowerCase()
    if (aSortKey < bSortKey) {
      return -1
    } else if (aSortKey > bSortKey) {
      return 1
    } else {
      return 0
    }
  })
}

export const searchResults = (state: ContactsState) => {
  const sections: SearchResultsSection[] = []

  let textileData: SearchResult[] | undefined
  if (state.textileSearchResults.error) {
    textileData = [{ key: 'textile_error', type: 'error', data: state.textileSearchResults.error }]
  } else if (state.textileSearchResults.results && state.textileSearchResults.results.length > 0) {
    textileData = state.textileSearchResults.results
      .filter((current, index, arr) => {
        const sames = arr.filter((el) => el.address === current.address)
        return sames.length === 1
      })
      .map((result) => {
        const selector = makeIsKnown(result.address)
        const isContact = selector(state)
        const adding = Object.keys(state.addingContacts).indexOf(result.address) > -1
        const textileResult: TextileSearchResult = { key: result.address, type: 'textile', data: { contact: result, isContact, adding } }
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
