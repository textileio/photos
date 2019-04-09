import '../Config'
import RNConfig from 'react-native-config'
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

import Textile from '@textile/react-native-sdk'

useScreens()

const { store, persistor } = configureStore()

class App extends Component {

  public backgroundFetchEventHandler = new BackgroundFetchEventHandler(store)
  public notificationEventHandler = new NotificationEventHandler(store)
  public textileNodeEventHandler = new TextileNodeEventHandler(store)
  public uploadEventHandler = new UploadEventHandler(store)
  public deepLinkEventHandler = new DeepLinkEventHandler(store)
  public textile = Textile

  public render() {
    return (
      <Provider store={store}>
        <PersistGate loading={undefined} persistor={persistor}>
          <RootContainer />
        </PersistGate>
      </Provider>
    )
  }
  public componentWillMount() {
    this.textile.setup(
      {
        RELEASE_TYPE: RNConfig.RN_RELEASE_TYPE
      },
      {
        TEXTILE_CAFE_TOKEN: RNConfig.RN_TEXTILE_CAFE_TOKEN,
        TEXTILE_CAFE_GATEWAY_URL: RNConfig.RN_TEXTILE_CAFE_GATEWAY_URL,
        TEXTILE_CAFE_OVERRIDE: RNConfig.RN_TEXTILE_CAFE_OVERRIDE
      }
    )
  }

  public componentWillUnmount() {
    if (super.componentWillUnmount) {
      super.componentWillUnmount()
    }
    this.textileNodeEventHandler.tearDown()
    this.uploadEventHandler.tearDown()
    this.deepLinkEventHandler.tearDown()
    this.textile.tearDown()
  }

  public componentDidCatch(error: any, info: any) {
    // TODO: Render some UI
    errorHandler(error, false)
  }
}

export default App
