import '../Config'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Textile from '@textile/react-native-sdk'

import RootContainer from './RootContainer'
import Loading from '../Components/Loading'
import configureStore from '../Redux/configureStore'
import DeepLinkEventHandler from '../Services/EventHandlers/DeepLinkEventHandler'
import BackgroundFetchEventHandler from '../Services/EventHandlers/BackgroundFetchEventHandler'
import NotificationEventHandler from '../Services/EventHandlers/NotificationEventHandler'
import { errorHandler } from '../Services/ErrorHandler'
import { color } from '../styles'

const { store, persistor } = configureStore()

class App extends Component {
  backgroundFetchEventHandler = new BackgroundFetchEventHandler(store)
  notificationEventHandler = new NotificationEventHandler(store)
  deepLinkEventHandler = new DeepLinkEventHandler(store)
  textile = Textile

  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={
            <Loading
              color={color.brandRed}
              text={'Loading persisted data...'}
            />
          }
          persistor={persistor}
        >
          <RootContainer />
        </PersistGate>
      </Provider>
    )
  }

  componentWillUnmount() {
    if (super.componentWillUnmount) {
      super.componentWillUnmount()
    }
    this.deepLinkEventHandler.tearDown()
  }

  componentDidCatch(error: any, info: any) {
    // TODO: Render some UI
    errorHandler(error, false)
  }
}

export default App
