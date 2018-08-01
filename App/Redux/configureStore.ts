import { createStore } from 'redux'
import { persistStore, persistReducer, PersistConfig, createMigrate, MigrationManifest, PersistedState, PersistState } from 'redux-persist'
import { AsyncStorage } from 'react-native'

import rootReducer from './RootReducer'
import { RootState } from './Types'

type Foo = {
  name: string,
  _persist?: PersistState
}

type Hmm = Foo & PersistedState

const manifest: MigrationManifest = {
  0: (state: PersistedState) => {
    const xxx = state as RootState
    type hmm = typeof xxx
    return xxx
  }
}

const persistConfig: PersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 4,
  whitelist: [],
  migrate: createMigrate(manifest, { debug: false })
}

const persistedReducer = persistReducer(persistConfig, rootReducer)