import '../Config'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import RootContainer from './RootContainer'
import configureStore from '../Redux/configureStore'
import { useScreens } from 'react-native-screens'
import TextileNodeEventHandler from '../Services/EventHandlers/TextileNodeEventHandler'
import UploadEventHandler from '../Services/EventHandlers/UploadEventHandler'
import DeepLinkEventHandler from '../Services/EventHandlers/DeepLinkEventHandler'
import BackgroundFetchEventHandler from '../Services/EventHandlers/BackgroundFetchEventHandler'
import NotificationEventHandler from '../Services/EventHandlers/NotificationEventHandler'
import { errorHandler } from '../Services/ErrorHandler'
import AccountActions from '../Redux/AccountRedux'

import Textile from '@textile/react-native-sdk'

useScreens()

const { store, persistor } = configureStore()

class App extends Component {

  backgroundFetchEventHandler = new BackgroundFetchEventHandler(store)
  notificationEventHandler = new NotificationEventHandler(store)
  textileNodeEventHandler = new TextileNodeEventHandler(store)
  uploadEventHandler = new UploadEventHandler(store)
  deepLinkEventHandler = new DeepLinkEventHandler(store)
  textile = Textile

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={undefined} persistor={persistor}>
          <RootContainer />
        </PersistGate>
      </Provider>
    )
  }

  componentWillUnmount() {
    if (super.componentWillUnmount) {
      super.componentWillUnmount()
    }
    this.textileNodeEventHandler.tearDown()
    this.uploadEventHandler.tearDown()
    this.deepLinkEventHandler.tearDown()
  }

  componentDidCatch(error: any, info: any) {
    // TODO: Render some UI
    errorHandler(error, false)
  }

  setup = async () => {
    // TODO: Move to a saga
    const phrase = await Textile.initialize(false, false)
    if (phrase) {
      store.dispatch(AccountActions.setRecoveryPhrase(phrase))
    }
  }
}

export default App
