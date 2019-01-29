import { call, put, take, takeLatest, cancelled, all, race } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { ActionType, getType } from 'typesafe-actions'
import {
  contacts,
  findContact,
  ContactInfo,
  ContactInfoQueryResult
} from '@textile/react-native-sdk'

import ContactsActions from '../../Redux/ContactsRedux'

export function * addFriends() {
  yield call(refreshContacts)
}

export function * refreshContacts() {
  try {
    const contactsResult: ReadonlyArray<ContactInfo> = yield call(contacts)
    yield put(ContactsActions.getContactsSuccess(contactsResult))
  } catch (error) {
    // skip for now
  }
}

function * searchTextile(searchString: string) {
  try {
    console.log('SEARCHING TEXTILE FOR:', searchString)
    const result: ContactInfoQueryResult = yield call(findContact, searchString, 20, 30)
    console.log('SEARCH RESULT', result)
    const isCancelled = yield cancelled()
    if (!isCancelled) {
      let results: ContactInfo[] = []
      if (result.local) {
        results = results.concat(result.local)
      }
      if (result.remote) {
        results = results.concat(result.remote)
      }
      yield put(ContactsActions.searchResultsTextile(results))
    } else {
      console.log('CANCELLED TEXTILE SEARCH!')
    }
  } catch (error) {
    yield put(ContactsActions.searchErrorTextile(error))
  }
}

function * searchAddressBook(searchString: string) {
  try {
    yield call(delay, 2000)
    const isCancelled = yield cancelled()
    if (!isCancelled) {
      yield put(ContactsActions.searchResultsAddressBook([
        'Bob',
        'Saga',
        'Stephen'
      ]))
    } else {
      console.log('CANCELLED ADDRESS BOOK SEARCH!')
    }
  } catch (error) {
    yield put(ContactsActions.searchErrorAddressBook(error))
  }
}

function * handleSearchRequest(action: ActionType<typeof ContactsActions.searchRequest>) {
  // debounce it
  yield call(delay, 1000)
  console.log('STARTING SEARCH')
  yield put(ContactsActions.searchStarted())
  const { searchString } = action.payload
  const { search, cancel } = yield race({
    search: all([call(searchTextile, searchString), call(searchAddressBook, searchString)]),
    cancel: take(getType(ContactsActions.clearSearch))
  })

  if (search) {
    console.log('FINISHED SEARCH')
  } else if (cancel) {
    console.log('WAS CANCELLED')
  } else {
    console.log('NO IDEA')
  }
}

export function * watchForSearchRequest() {
  yield takeLatest(getType(ContactsActions.searchRequest), handleSearchRequest)
}
