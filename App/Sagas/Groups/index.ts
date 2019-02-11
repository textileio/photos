import { all, call, takeEvery } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import GroupsActions from '../../Redux/GroupsRedux'
import {
  handleRefreshGroupRequest,
  handleLoadGroupItemsRequest
} from './GroupsSagas'

export default function * () {
  yield all([
    takeEvery(getType(GroupsActions.refreshGroup.request), handleRefreshGroupRequest),
    takeEvery(getType(GroupsActions.loadGroupItems.request), handleLoadGroupItemsRequest)
  ])
}
