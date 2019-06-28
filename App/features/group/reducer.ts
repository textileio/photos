import { combineReducers } from 'redux'
import { ActionType } from 'typesafe-actions'
import { PersistConfig, persistReducer } from 'redux-persist'
import { AsyncStorage } from 'react-native'

import { feedReducer, FeedState } from './feed'
import { addMessageReducer, AddMessageState } from './add-message'
import { addPhotoReducer, ProcessingImagesState } from './add-photo'
import { renameGroupReducer, RenameGroupState } from './rename-group'
import { fileSyncReducer, FileSyncState } from './file-sync'

import * as actions from './actions'

export interface GroupState {
  feed: FeedState
  addMessage: AddMessageState
  addPhoto: ProcessingImagesState
  renameGroup: RenameGroupState
  fileSync: FileSyncState
}

export type GroupAction = ActionType<typeof actions>

const persistConfig: PersistConfig = {
  key: 'group',
  storage: AsyncStorage,
  whitelist: ['addPhoto', 'fileSync'],
  debug: false
}

const reducer = combineReducers<GroupState>({
  feed: feedReducer,
  addMessage: addMessageReducer,
  addPhoto: addPhotoReducer,
  renameGroup: renameGroupReducer,
  fileSync: fileSyncReducer
})

export default persistReducer(persistConfig, reducer)
