import { all, call, takeEvery } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

import {
  addFriends,
  refreshContacts,
  handleSearchRequest
} from './ContactsSagas'
import UIActions from '../../Redux/UIRedux'
import ContactsActions from '../../Redux/ContactsRedux'

export default function * contactsSaga () {
  yield all([
    takeEvery(getType(UIActions.addFriendRequest), addFriends),
    takeEvery(getType(ContactsActions.getContactsRequest), refreshContacts),
    call(handleSearchRequest)
  ])
}
