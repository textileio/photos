import { Store } from 'redux'
import { AppState, AppStateStatus, DeviceEventEmitter } from 'react-native'

import { RootState } from '../../Redux/Types'

import TextileNodeActions, { TextileAppStateStatus } from '../../Redux/TextileNodeRedux'

export default class AppStateEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  handleAppState (nextState: AppStateStatus) {
    // AXH
    DeviceEventEmitter.emit('@textile/appNextState', {nextState})

    // // OLD
    // const currentState = this.store.getState().textileNode.appState
    // const newState: TextileAppStateStatus = nextState === 'background' && (currentState === 'active' || currentState === 'inactive') ? 'backgroundFromForeground' : nextState
    // if (newState !== currentState || newState === 'background') {
    //   // TODO: Remove the store based init.
    //   this.store.dispatch(TextileNodeActions.appStateChange(currentState, newState))

    //   DeviceEventEmitter.emit('@textile/appStateChange', {previousState: currentState, newState})
    // }
  }

  setup () {
    AppState.addEventListener('change', this.handleAppState.bind(this))
  }

  tearDown () {
    AppState.removeEventListener('change', this.handleAppState.bind(this))
  }
}
