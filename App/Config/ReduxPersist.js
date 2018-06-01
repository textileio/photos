import immutablePersistenceTransform from '../Services/ImmutablePersistenceTransform'
import { AsyncStorage } from 'react-native'
import { createMigrate } from 'redux-persist'

const migrations = {
  0: (state) => {
    // migration clear out device state
    return {
      ...state,
      textile: {
        ...state.textile,
        preferences: {
          verboseUi: false
        }
      }
    }
  }
}

// More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
const REDUX_PERSIST = {
  active: true,
  reducerVersion: '1.0',
  storeConfig: {
    key: 'primary',
    version: 0,
    storage: AsyncStorage,
    migrate: createMigrate(migrations, { debug: false }),
    // Reducer keys that you do NOT want stored to persistence here.
    blacklist: ['nav', 'ipfs', 'auth', 'ui'],
    // Optionally, just specify the keys you DO want stored to persistence.
    // An empty array means 'don't store any reducers' -> infinitered/ignite#409
    // whitelist: [],
    transforms: [immutablePersistenceTransform]
  }
}

export default REDUX_PERSIST
