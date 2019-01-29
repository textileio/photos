import { call, put, take } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { ActionType, getType } from 'typesafe-actions'
import {
  contacts,
  ContactInfo
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

export function * handleSearchRequest() {
  while (true) {
    const action: ActionType<typeof ContactsActions.searchRequest> = yield take(getType(ContactsActions.searchRequest))
    yield call(delay, 2000)
    yield put(ContactsActions.searchResultsAddressBook([
      'Bob',
      'Saga',
      'Stephen'
    ]))
    yield call(delay, 1000)
    yield put(ContactsActions.searchResultsTextile([
      { id: '1', username: 'user1', address: 'a', created: 'now', updated: 'now' },
      { id: '2', username: 'user2', address: 'b', created: 'now', updated: 'now' }
    ]))
  }
}
