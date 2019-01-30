import { Store } from 'redux'
import { AppState, AppStateStatus, DeviceEventEmitter } from 'react-native'

import { RootState } from '../../Redux/Types'

export default class AppStateEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  handleAppState (nextState: AppStateStatus) {
    DeviceEventEmitter.emit('@textile/appNextState', {nextState})
  }

  setup () {
    AppState.addEventListener('change', this.handleAppState.bind(this))
  }

  tearDown () {
    AppState.removeEventListener('change', this.handleAppState.bind(this))
  }
}
