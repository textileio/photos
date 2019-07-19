import { createStore, applyMiddleware } from 'redux'
import { persistStore } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import Reactotron from 'reactotron-react-native'

import DebugConfig from '../Config/DebugConfig'
import rootReducer from './RootReducer'
import StartupActions from '../Redux/StartupRedux'
import rootSaga from '../Sagas'

export default () => {
  const sagaMonitor = DebugConfig.useReactotron
    ? Reactotron.createSagaMonitor()
    : undefined
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor })

  const createAppropriateStore = DebugConfig.useReactotron
    ? Reactotron.createStore
    : createStore
  const store = createAppropriateStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
  )

  const bootstrappedCallback = () => store.dispatch(StartupActions.startup())
  const persistor = persistStore(store, undefined, bootstrappedCallback)

  sagaMiddleware.run(rootSaga)

  return { store, persistor }
}
