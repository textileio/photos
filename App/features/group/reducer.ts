import { combineReducers } from 'redux'
import { ActionType } from 'typesafe-actions'

import { feedReducer, FeedState } from './feed'
import { addMessageReducer, AddMessageState } from './add-message'
import { addPhotoReducer, ProcessingImagesState } from './add-photo'
import { renameGroupReducer, RenameGroupState } from './rename-group'

import * as actions from './actions'

export interface GroupState {
  feed: FeedState
  addMessage: AddMessageState
  addPhoto: ProcessingImagesState
  renameGroup: RenameGroupState
}

export type GroupAction = ActionType<typeof actions>

export default combineReducers<GroupState>({
  feed: feedReducer,
  addMessage: addMessageReducer,
  addPhoto: addPhotoReducer,
  renameGroup: renameGroupReducer
})
