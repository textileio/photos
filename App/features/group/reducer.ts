import { combineReducers } from 'redux'
import { ActionType } from 'typesafe-actions'

import { feedReducer, FeedState } from './feed'
import { addMessageReducer, AddMessageState } from './add-message'
import { addPhotoReducer, ProcessingImagesState } from './add-photo'

import * as actions from './actions'

export interface GroupState {
  feed: FeedState
  addMessage: AddMessageState
  addPhoto: ProcessingImagesState
}

export type GroupAction = ActionType<typeof actions>

export default combineReducers<GroupState>({
  feed: feedReducer,
  addMessage: addMessageReducer,
  addPhoto: addPhotoReducer
})
