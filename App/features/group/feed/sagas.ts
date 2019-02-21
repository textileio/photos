import { ActionType, getType } from 'typesafe-actions'
import { call, put, select, takeEvery, all } from 'redux-saga/effects'
import Textile, { ThreadFeedItem } from '@textile/react-native-sdk'
import { refreshFeed, loadFeedItems } from './actions'
import { feedOffsetForGroup } from './selectors'
import { RootState } from '../../../Redux/Types'

export function * handleRefreshGroupRequest(action: ActionType<typeof refreshFeed.request>) {
  const { id, limit } = action.payload
  try {
    const items: ReadonlyArray<ThreadFeedItem> = yield call(Textile.threadFeed, '', limit || -1, id)
    yield put(refreshFeed.success({ id, items }))
  } catch (error) {
    yield put(refreshFeed.failure({ id, error }))
  }
}

export function * handleLoadGroupItemsRequest(action: ActionType<typeof loadFeedItems.request>) {
  const { id, limit } = action.payload
  try {
    const offset: string | undefined = yield select((state: RootState, id: string) => feedOffsetForGroup(state.group.feed, id), id)
    const items: ReadonlyArray<ThreadFeedItem> = yield call(Textile.threadFeed, offset || '', limit || -1, id)
    yield put(loadFeedItems.success({ id, items }))
  } catch (error) {
    yield put(loadFeedItems.failure({ id, error }))
  }
}

export default function * () {
  yield all([
    takeEvery(getType(refreshFeed.request), handleRefreshGroupRequest),
    takeEvery(getType(loadFeedItems.request), handleLoadGroupItemsRequest)
  ])
}
