import { combineReducers } from 'redux'
import { ActionType } from 'typesafe-actions'
import { PersistConfig, persistReducer } from 'redux-persist'
import { AsyncStorage } from 'react-native'

import { feedReducer, FeedState } from './feed'
import { addMessageReducer, AddMessageState } from './add-message'
import { addPhotoReducer, ProcessingImagesState } from './add-photo'
import { renameGroupReducer, RenameGroupState } from './rename-group'
import { ignoreReducer, IgnoreState } from './ignore'

import * as actions from './actions'

export interface GroupState {
  feed: FeedState
  addMessage: AddMessageState
  addPhoto: ProcessingImagesState
  renameGroup: RenameGroupState
  ignore: IgnoreState
}

export type GroupAction = ActionType<typeof actions>

const persistConfig: PersistConfig = {
  key: 'group',
  storage: AsyncStorage,
  whitelist: ['addPhoto'],
  debug: false
}

const reducer = combineReducers<GroupState>({
  feed: feedReducer,
  addMessage: addMessageReducer,
  addPhoto: addPhotoReducer,
  renameGroup: renameGroupReducer,
  ignore: ignoreReducer
})

export default persistReducer(persistConfig, reducer)
