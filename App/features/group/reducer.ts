import { combineReducers } from 'redux'
import { ActionType } from 'typesafe-actions'
import { createMigrate, PersistConfig, MigrationManifest, persistReducer } from 'redux-persist'
import { AsyncStorage } from 'react-native'

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

const migrations: MigrationManifest = {
  0: persistedState => {
    const state = persistedState as any
    const { feed, addMessage, renameGroup, ...rest } = state
    return rest
  }
}

const persistConfig: PersistConfig = {
  key: 'group',
  storage: AsyncStorage,
  version: 0,
  whitelist: [
    'addPhoto'
  ],
  migrate: createMigrate(migrations, { debug: false })
}

const reducer = combineReducers<GroupState>({
  feed: feedReducer,
  addMessage: addMessageReducer,
  addPhoto: addPhotoReducer,
  renameGroup: renameGroupReducer
})

export default persistReducer(persistConfig, reducer)
