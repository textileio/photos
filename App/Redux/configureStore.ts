import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import Reactotron from '../Config/ReactotronConfig'

import DebugConfig from '../Config/DebugConfig'
import persistConfig from '../Config/ReduxPersist'
import rootReducer from './RootReducer'
import StartupActions from '../Redux/StartupRedux'
import rootSaga from '../Sagas'

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  const sagaMiddleware = createSagaMiddleware()
  const enhancers = DebugConfig.useReactotron ? compose(applyMiddleware(sagaMiddleware), Reactotron.createEnhancer!()) : applyMiddleware(sagaMiddleware)
  const store = createStore(persistedReducer, enhancers)

  const bootstrappedCallback = () => store.dispatch(StartupActions.startup())
  const persistor = persistStore(store, undefined, bootstrappedCallback)

  sagaMiddleware.run(rootSaga, store.dispatch)

  return { store, persistor }
}
