import { Store } from 'redux'
import {
  DeviceEventEmitter
} from 'react-native'

import { RootState } from '../../Redux/Types'

import MockBridge from '../../Redux/MockBridge'

export default class TextileSDKEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  setup () {
    DeviceEventEmitter.addListener('@textile/startNodeFinished', () => {
      this.store.dispatch(MockBridge.startNodeFinished())
    })
    DeviceEventEmitter.addListener('@textile/stopNodeAfterDelayStarting', () => {
      this.store.dispatch(MockBridge.stopNodeAfterDelayStarting())
    })
    DeviceEventEmitter.addListener('@textile/stopNodeAfterDelayCancelled', () => {
      this.store.dispatch(MockBridge.stopNodeAfterDelayCancelled())
    })
    DeviceEventEmitter.addListener('@textile/stopNodeAfterDelayFinishing', () => {
      this.store.dispatch(MockBridge.stopNodeAfterDelayFinishing())
    })
    DeviceEventEmitter.addListener('@textile/stopNodeAfterDelayComplete', () => {
      this.store.dispatch(MockBridge.stopNodeAfterDelayComplete())
    })
    DeviceEventEmitter.addListener('@textile/appStateChange', (payload) => {
      this.store.dispatch(MockBridge.appStateChange(payload.previousState, payload.newState))
    })
    DeviceEventEmitter.addListener('@textile/newErrorMessage', (payload) => {
      this.store.dispatch(MockBridge.newErrorMessage(payload.error))
    })
  }

  tearDown () {
    DeviceEventEmitter.removeAllListeners()
  }
}
