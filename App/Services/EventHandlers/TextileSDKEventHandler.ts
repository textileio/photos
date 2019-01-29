import { Store } from 'redux'
import {
  DeviceEventEmitter
} from 'react-native'

import { RootState } from '../../Redux/Types'

import MockBridge from '../../Redux/MockBridge'
import AccountActions from '../../Redux/AccountRedux'
import MigrationActions from '../../Redux/MigrationRedux'

export default class TextileSDKEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  setup () {
    // New Bridge actions
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
    DeviceEventEmitter.addListener('@textile/updateProfile', () => {
      this.store.dispatch(MockBridge.updateProfile())
    })
    DeviceEventEmitter.addListener('@textile/newErrorMessage', (payload) => {
      this.store.dispatch(MockBridge.newErrorMessage(payload.error))
    })
    // Account actions
    DeviceEventEmitter.addListener('@textile/setRecoveryPhrase', (payload) => {
      this.store.dispatch(AccountActions.setRecoveryPhrase(payload.recoveryPhrase))
    })
    DeviceEventEmitter.addListener('@textile/walletInitSuccess', () => {
      this.store.dispatch(AccountActions.initSuccess())
    })
    // Migration actions
    DeviceEventEmitter.addListener('@textile/migrationNeeded', (payload) => {
      this.store.dispatch(MigrationActions.migrationNeeded())
    })
  }

  tearDown () {
    DeviceEventEmitter.removeAllListeners()
  }
}
