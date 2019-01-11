import { Store } from 'redux'
import { AppState, AppStateStatus } from 'react-native'

import { RootState } from '../../Redux/Types'

import TextileNodeActions, { TextileAppStateStatus } from '../../Redux/TextileNodeRedux'

export default class AppStateEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  handleAppState (nextState: AppStateStatus) {
    const currentState = this.store.getState().textileNode.appState
    const newState: TextileAppStateStatus = nextState === 'background' && (currentState === 'active' || currentState === 'inactive') ? 'backgroundFromForeground' : nextState
    if (newState !== currentState || newState === 'background') {
      this.store.dispatch(TextileNodeActions.appStateChange(currentState, newState))
    }
  }

  setup () {
    // capture whatever state already exists in the system
    const initialState = AppState.currentState
    // setup our listener for changes
    AppState.addEventListener('change', this.handleAppState.bind(this))
      // if initialState === null we know we'll get our new state via the listener
    if (initialState !== null) {
      this.handleAppState(initialState)
    }
  }

  tearDown () {
    AppState.removeEventListener('change', this.handleAppState.bind(this))
  }
}
