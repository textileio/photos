import ReduxPersist from '../Config/ReduxPersist'
import { AsyncStorage } from 'react-native'
import DebugConfig from '../Config/DebugConfig'
import {Persistor} from 'redux-persist/es/types'

const updateReducers = (store: Object, persistor: Persistor) => {
  const reducerVersion = ReduxPersist.reducerVersion

  // Check to ensure latest reducer version
  AsyncStorage.getItem('reducerVersion').then((localVersion) => {
    if (localVersion !== reducerVersion) {
      if (DebugConfig.useReactotron) {
        console.tron.display({
          name: 'PURGE',
          value: {
            'Old Version:': localVersion,
            'New Version:': reducerVersion
          },
          preview: 'Reducer Version Change Detected',
          important: true
        })
      }
      // Purge store
      persistor.purge()
      AsyncStorage.setItem('reducerVersion', reducerVersion)
    }
  }).catch(() => {
    AsyncStorage.setItem('reducerVersion', reducerVersion)
  })
}

export default { updateReducers }
