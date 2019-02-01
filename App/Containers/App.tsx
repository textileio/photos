import '../Config'
import RNConfig from 'react-native-config'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import RootContainer from './RootContainer'
import configureStore from '../Redux/configureStore'
import { useScreens } from 'react-native-screens'
// import LocationEventHandler from '../Services/EventHandlers/LocationEventHandler'
import AppStateEventHander from '../Services/EventHandlers/AppStateEventHandler'
import TextileNodeEventHandler from '../Services/EventHandlers/TextileNodeEventHandler'
import UploadEventHandler from '../Services/EventHandlers/UploadEventHandler'
import DeepLinkEventHandler from '../Services/EventHandlers/DeepLinkEventHandler'
import BackgroundFetchEventHandler from '../Services/EventHandlers/BackgroundFetchEventHandler'
import NotificationEventHandler from '../Services/EventHandlers/NotificationEventHandler'
import { errorHandler } from '../Services/ErrorHandler'

import {Textile} from '../SDK'

useScreens()

const { store, persistor } = configureStore()

class App extends Component {

  appStateEventHander = new AppStateEventHander(store)
  backgroundFetchEventHandler = new BackgroundFetchEventHandler(store)
  notificationEventHandler = new NotificationEventHandler(store)
  textileNodeEventHandler = new TextileNodeEventHandler(store)
  uploadEventHandler = new UploadEventHandler(store)
  deepLinkEventHandler = new DeepLinkEventHandler(store)
  textile = new Textile({})

  render () {
    return (
      <Provider store={store}>
        <PersistGate loading={undefined} persistor={persistor}>
          <RootContainer />
        </PersistGate>
      </Provider>
    )
  }

  componentWillMount () {
    this.textile.setup({
      RELEASE_TYPE: RNConfig.RN_RELEASE_TYPE,
      TEXTILE_CAFE_GATEWAY_URL: RNConfig.RN_TEXTILE_CAFE_GATEWAY_URL,
      TEXTILE_CAFE_OVERRIDE: RNConfig.RN_TEXTILE_CAFE_OVERRIDE,
      TEXTILE_CAFE_TOKEN: RNConfig.RN_TEXTILE_CAFE_TOKEN
    })
  }

  componentWillUnmount () {
    if (super.componentWillUnmount) {
      super.componentWillUnmount()
    }
    this.appStateEventHander.tearDown()
    this.notificationEventHandler.tearDown()
    this.textileNodeEventHandler.tearDown()
    this.uploadEventHandler.tearDown()
    this.deepLinkEventHandler.tearDown()
    this.backgroundFetchEventHandler.tearDown()
    this.textile.tearDown()
  }

  componentDidCatch(error: any, info: any) {
    // TODO: Render some UI
    errorHandler(error, false)
  }
}

export default App
