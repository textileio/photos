import { ActionType } from 'typesafe-actions'
import { call, put, select } from 'redux-saga/effects'
import Textile, { API, ThreadFeedItem } from '@textile/react-native-sdk'
import GroupsActions from '../../Redux/GroupsRedux'
import { offsetForGroup } from '../../Redux/GroupsSelectors'
import ProcessingMessagesActions from '../../Redux/ProcessingMessagesRedux'

export function * handleRefreshGroupRequest(action: ActionType<typeof GroupsActions.refreshGroup.request>) {
  const { id, limit } = action.payload
  try {
    const items: ReadonlyArray<ThreadFeedItem> = yield call(Textile.threadFeed, '', limit || -1, id)
    yield put(GroupsActions.refreshGroup.success({ id, items }))
  } catch (error) {
    yield put(GroupsActions.refreshGroup.failure({ id, error }))
  }
}

export function * handleLoadGroupItemsRequest(action: ActionType<typeof GroupsActions.loadGroupItems.request>) {
  const { id, limit } = action.payload
  try {
    const offset: string | undefined = yield select(offsetForGroup, id)
    const items: ReadonlyArray<ThreadFeedItem> = yield call(Textile.threadFeed, offset || '', limit || -1, id)
    yield put(GroupsActions.loadGroupItems.success({ id, items }))
  } catch (error) {
    yield put(GroupsActions.loadGroupItems.failure({ id, error }))
  }
}

export function * handleAddMessageRequest(action: ActionType<typeof ProcessingMessagesActions.addMessage.request>) {
  const { id, groupId, body } = action.payload
  try {
    yield call(Textile.addThreadMessage, groupId, body)
    yield put(ProcessingMessagesActions.addMessage.success({ id, groupId }))
  } catch (error) {
    yield put(ProcessingMessagesActions.addMessage.failure({ id, groupId, error }))
  }
}
