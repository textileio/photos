import { combineReducers } from 'redux'
import { ActionType } from 'typesafe-actions'

import { feedReducer, FeedState } from './feed'
import { addMessageReducer, AddMessageState } from './add-message'

import * as actions from './actions'

export interface GroupState {
  feed: FeedState
  addMessage: AddMessageState
}

export type GroupAction = ActionType<typeof actions>

export default combineReducers<GroupState>({
  feed: feedReducer,
  addMessage: addMessageReducer
})
