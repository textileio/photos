import {
  call,
  put,
  take,
  takeLatest,
  takeEvery,
  cancelled,
  all,
  race,
  select
} from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { ActionType, getType } from 'typesafe-actions'
import { Platform, PermissionsAndroid } from 'react-native'
import Contacts from 'react-native-contacts'
import {
  contacts,
  findContact,
  addContact,
  ContactInfo,
  ContactInfoQueryResult
} from '@textile/react-native-sdk'
import Config from 'react-native-config'

import ContactsActions from '../../Redux/ContactsRedux'
import { getPeerId, getUsername } from '../../Redux/AccountSelectors'
import { composeMessage } from '../../NativeModules/MessageComposer'

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

export function * watchForAddContactRequests() {
  yield takeEvery(getType(ContactsActions.addContactRequest), handleAddContactRequest)
}

function * handleAddContactRequest(action: ActionType<typeof ContactsActions.addContactRequest>) {
  const { contactInfo } = action.payload
  try {
    yield call(addContact, contactInfo)
    yield put(ContactsActions.addContactSuccess(contactInfo))
    yield call(refreshContacts)
  } catch (error) {
    yield put(ContactsActions.addContactError(contactInfo, error))
  }
}

function * searchTextile(searchString: string) {
  try {
    const result: ContactInfoQueryResult = yield call(findContact, searchString, 20, 3)
    const isCancelled = yield cancelled()
    if (!isCancelled) {
      let results: ContactInfo[] = []
      if (result.local) {
        results = results.concat(result.local)
      }
      if (result.remote) {
        results = results.concat(result.remote)
      }
      const distinct: ContactInfo[] = []
      const map = new Map<string, boolean>()
      for (const item of results) {
        if (!map.has(item.id)) {
          map.set(item.id, true)
          distinct.push(item)
        }
      }
      yield put(ContactsActions.searchResultsTextile(distinct))
    }
  } catch (error) {
    yield put(ContactsActions.searchErrorTextile(error))
  }
}

function * searchAddressBook(searchString: string) {
  try {
    const permissions = Platform.OS === 'ios' ? requestPermissionsIOS : requestPermissionsAndroid
    const result: 'undefined' | 'authorized' | 'denied' = yield call(permissions)
    if (result !== 'authorized') {
      return
    }
    const contacts: Contacts.Contact[] = yield call(getContactsMatching, searchString)
    const isCancelled = yield cancelled()
    if (!isCancelled) {
      yield put(ContactsActions.searchResultsAddressBook(contacts))
    }
  } catch (error) {
    yield put(ContactsActions.searchErrorAddressBook(error))
  }
}

function * executeSearchRequest(searchString: string) {
  yield put(ContactsActions.searchStarted())
  yield race({
    search: all([call(searchTextile, searchString), call(searchAddressBook, searchString)]),
    cancel: take(getType(ContactsActions.clearSearch))
  })
}

function * handleSearchRequest(action: ActionType<typeof ContactsActions.searchRequest>) {
  // debounce it, but cancel it we clear search
  const { debounce } = yield race({
    debounce: call(delay, 1000),
    cancel: take(getType(ContactsActions.clearSearch))
  })
  if (debounce) {
    yield call(executeSearchRequest, action.payload.searchString)
  }
}

export function * watchForSearchRequest() {
  yield takeLatest(getType(ContactsActions.searchRequest), handleSearchRequest)
}

export function * sendInviteMessage() {
  while (true) {
    const action: ActionType<typeof ContactsActions.authorInviteRequest> = yield take(getType(ContactsActions.authorInviteRequest))
    const { phoneNumbers } = action.payload.contact
    const iphone = phoneNumbers.find((number) => number.label.toLowerCase() === 'iphone')
    const mobile = phoneNumbers.find((number) => number.label.toLowerCase() === 'mobile')
    const home = phoneNumbers.find((number) => number.label.toLowerCase() === 'home')
    const work = phoneNumbers.find((number) => number.label.toLowerCase() === 'work')
    const sendTo = iphone || mobile || home || work
    if (sendTo) {
      const username: string | undefined = yield select(getUsername)
      const peerId: string | undefined = yield select(getPeerId)
      const url = Platform.OS === 'ios' ? Config.RN_IOS_STORE_LINK : Config.RN_ANDROID_STORE_LINK
      let message = `Join me on Textile Photos: ${url}`
      if (username) {
        message = `${message}\nMy username: ${username}`
      }
      if (peerId) {
        message = `${message}\nMy peer id snippet: ${peerId.substr(peerId.length - 8, 8)}`
      }
      yield call(composeMessage, sendTo.number, message)
    }
  }
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
