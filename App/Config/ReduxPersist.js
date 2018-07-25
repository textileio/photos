import immutablePersistenceTransform from '../Services/ImmutablePersistenceTransform'
import { AsyncStorage } from 'react-native'
import { createMigrate } from 'redux-persist'

const migrations = {
  0: (state) => {
    // Migration to add user preferences with option for verboseUi
    return {
      ...state,
      textile: state.textile.merge({
        preferences: {
          verboseUi: false
        },
        camera: {}
      })
    }
  },
  1: (state) => {
    // Migration to add remaining retry attempts to any persisted image data
    const updatedItems = state.textile.images.items.map(item => {
      return {...item, remainingUploadAttempts: 3}
    })
    return {
      ...state,
      textile: state.textile.merge({
        images: state.textile.images.merge({ items: updatedItems })
      })
    }
  },
  2: (state) => {
    const uris = state.textile.camera && state.textile.camera.processed ? state.textile.camera.processed : []
    let processed = {}
    for (let uri of uris) {
      processed[uri] = 'complete'
    }
    return {
      ...state,
      textile: state.textile.merge({
        camera: {processed}
      })
    }
  },
  3: (state) => {
    return {
      ...state,
      textile: state.textile.merge({
        onboarded: false
      })
    }
  },
  4: (state) => {
    // Not migrating devices because we didn't previously have meaningful device data
    return {
      ...state,
      preferences: {
        onboarded: state.textile.onboarded,
        verboseUi: state.textile.preferences.verboseUi
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
    version: 4,
    storage: AsyncStorage,
    migrate: createMigrate(migrations, { debug: false }),
    // Reducer keys that you do NOT want stored to persistence here.
    // blacklist: ['nav', 'ipfs', 'auth', 'ui'],
    // Optionally, just specify the keys you DO want stored to persistence.
    // An empty array means 'don't store any reducers' -> infinitered/ignite#409
    whitelist: ['preferences', 'uploadingImages', 'cameraRoll'],
    transforms: [immutablePersistenceTransform]
  }
}

export default REDUX_PERSIST
