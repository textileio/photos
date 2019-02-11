import { ActionType } from 'typesafe-actions'
import { call, put, select } from 'redux-saga/effects'
import { API, ThreadFeedItem } from '@textile/react-native-sdk'
import GroupsActions from '../../Redux/GroupsRedux'
import { offsetForGroup } from '../../Redux/GroupsSelectors'

export function * handleRefreshGroupRequest(action: ActionType<typeof GroupsActions.refreshGroup.request>) {
  const { id, limit } = action.payload
  try {
    const items: ReadonlyArray<ThreadFeedItem> = yield call(API.threadFeed, '', limit || -1, id)
    yield put(GroupsActions.refreshGroup.success({ id, items }))
  } catch (error) {
    yield put(GroupsActions.refreshGroup.failure({ id, error }))
  }
}

export function * handleLoadGroupItemsRequest(action: ActionType<typeof GroupsActions.loadGroupItems.request>) {
  const { id, limit } = action.payload
  try {
    const offset: string | undefined = yield select(offsetForGroup, id)
    const items: ReadonlyArray<ThreadFeedItem> = yield call(API.threadFeed, offset || '', limit || -1, id)
    yield put(GroupsActions.loadGroupItems.success({ id, items }))
  } catch (error) {
    yield put(GroupsActions.loadGroupItems.failure({ id, error }))
  }
}
