import { ActionType, getType } from 'typesafe-actions'
import { call, put, select, takeEvery, all } from 'redux-saga/effects'
import Textile, { pb } from '@textile/react-native-sdk'
import { refreshFeed, loadFeedItems } from './actions'
import { feedOffsetForGroup } from './selectors'
import { RootState } from '../../../Redux/Types'

export function * handleRefreshGroupRequest(action: ActionType<typeof refreshFeed.request>) {
  const { id, limit } = action.payload
  try {
    const items: ReadonlyArray<pb.FeedItem.AsObject> = yield call(Textile.feed, '', limit || -1, pb.FeedMode.ANNOTATED, id) // TODO: Update to STACKS
    yield put(refreshFeed.success({ id, items }))
  } catch (error) {
    yield put(refreshFeed.failure({ id, error }))
  }
}

export function * handleLoadGroupItemsRequest(action: ActionType<typeof loadFeedItems.request>) {
  const { id, limit } = action.payload
  try {
    const offset: string | undefined = yield select((state: RootState, id: string) => feedOffsetForGroup(state.group.feed, id), id)
    const items: ReadonlyArray<pb.FeedItem.AsObject> = yield call(Textile.feed, offset || '', limit || -1, pb.FeedMode.ANNOTATED, id)
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
