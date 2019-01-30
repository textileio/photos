import { call, put, take, takeLatest, cancelled, all, race } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { ActionType, getType } from 'typesafe-actions'
import { Platform, PermissionsAndroid } from 'react-native'
import Contacts from 'react-native-contacts'
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
    const result: ContactInfoQueryResult = yield call(findContact, searchString, 20, 3)
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
    const permissions = Platform.OS === 'ios' ? requestPermissionsIOS : requestPermissionsAndroid
    yield call(permissions)
    const contacts: Contacts.Contact[] = yield call(getContactsMatching, searchString)
    const isCancelled = yield cancelled()
    if (!isCancelled) {
      yield put(ContactsActions.searchResultsAddressBook(contacts))
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

async function requestPermissionsAndroid() {
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    {
      title: 'Contacts',
      message: 'Authorizing access to your contacts makes it easy for you to invite others to Textile. None of you contact data is saved or transmitted in any way.'
    }
  )
  if (result === PermissionsAndroid.RESULTS.GRANTED) {
    return 'authorized'
  } else {
    return 'denied'
  }
}

async function requestPermissionsIOS() {
  return new Promise<'undefined' |  'authorized' | 'denied'>((resolve, reject) => {
    Contacts.checkPermission((err, permission) => {
      if (err) {
        reject(err)
        return
      }
      if (permission === 'undefined') {
        Contacts.requestPermission((err, permission) => {
          if (err) {
            reject(err)
            return
          } else {
            resolve(permission)
          }
        })
      } else {
        resolve(permission)
      }
    })
  })
}

async function getContactsMatching(searchString: string) {
  return new Promise<Contacts.Contact[]>((resolve, reject) => {
    Contacts.getContactsMatchingString(searchString, (err, contacts) => {
      if (err) {
        reject(err)
        return
      }
      resolve(contacts)
    })
  })
}
