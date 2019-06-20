import { ActionType, getType } from 'typesafe-actions'
import { call, put, select, takeEvery, all } from 'redux-saga/effects'
import Textile, {
  IFeedRequest,
  FeedRequest,
  IFeedItemList,
  FeedItemData
} from '@textile/react-native-sdk'
import { refreshFeed, loadFeedItems } from './actions'
import { feedOffsetForGroup } from './selectors'
import { RootState } from '../../../Redux/Types'

export function* handleRefreshGroupRequest(
  action: ActionType<typeof refreshFeed.request>
) {
  const { id, limit } = action.payload

  try {
    const request: IFeedRequest = {
      thread: id,
      offset: '',
      limit: limit || -1,
      mode: FeedRequest.Mode.ANNOTATED
    }
    const list: ReadonlyArray<FeedItemData> = yield call(
      Textile.feed.list,
      request
    )
    yield put(refreshFeed.success({ id, items: list }))
  } catch (error) {
    yield put(refreshFeed.failure({ id, error }))
  }
}

export function* handleLoadGroupItemsRequest(
  action: ActionType<typeof loadFeedItems.request>
) {
  const { id, limit } = action.payload
  try {
    const offset: string | undefined = yield select(
      (state: RootState, id: string) =>
        feedOffsetForGroup(state.group.feed, id),
      id
    )
    const request: IFeedRequest = {
      thread: id,
      offset: offset || '',
      limit: limit || -1,
      mode: FeedRequest.Mode.ANNOTATED
    }
    const list: ReadonlyArray<FeedItemData> = yield call(
      Textile.feed.list,
      request
    )
    yield put(loadFeedItems.success({ id, items: list }))
  } catch (error) {
    yield put(loadFeedItems.failure({ id, error }))
  }
}

export default function*() {
  yield all([
    takeEvery(getType(refreshFeed.request), handleRefreshGroupRequest),
    takeEvery(getType(loadFeedItems.request), handleLoadGroupItemsRequest)
  ])
}
