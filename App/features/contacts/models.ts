import { pb } from '@textile/react-native-sdk'
import Contacts from 'react-native-contacts'

export interface AddingContact {
  readonly error?: string
}

export interface AddingContacts {
  readonly [key: string]: AddingContact
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
