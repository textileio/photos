import '../Config'
import React from 'react'
import { Component } from 'react'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import RootContainer from './RootContainer'
import configureStore from '../Redux/configureStore'
import AppStateEventHander from '../Services/AppStateEventHandler'
import TextileNodeEventHandler from '../Services/TextileNodeEventHandler'
import UploadEventHandler from '../Services/UploadEventHandler'
import DeepLinkEventHandler from '../Services/DeepLinkEventHandler'
import BackgroundTaskEventHandler from '../Services/BackgroundTaskEventHandler'

const { store, persistor } = configureStore()

const backgroundTaskEventHandler = new BackgroundTaskEventHandler(store)

class App extends Component {

  appStateEventHander = new AppStateEventHander(store)
  textileNodeEventHandler = new TextileNodeEventHandler(store)
  uploadEventHandler = new UploadEventHandler(store)
  deepLinkEventHandler = new DeepLinkEventHandler()

  render () {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootContainer />
        </PersistGate>
      </Provider>
    )
  }

  componentDidMount () {
    backgroundTaskEventHandler.schedule()
  }

  componentWillUnmount () {
    if (super.componentWillUnmount) {
      super.componentWillUnmount()
    }
    this.appStateEventHander.tearDown()
    this.textileNodeEventHandler.tearDown()
    this.uploadEventHandler.tearDown()
    this.deepLinkEventHandler.tearDown()
    backgroundTaskEventHandler.tearDown()
  }
}

export default App
