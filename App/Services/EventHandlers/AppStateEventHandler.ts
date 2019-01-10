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
    const newState: TextileAppStateStatus =  nextState === 'background' && (currentState === 'active' || currentState === 'inactive') ? 'backgroundFromForeground' : nextState
    if (newState !== currentState || newState === 'background') {
      this.store.dispatch(TextileNodeActions.appStateChange(currentState, newState))
    }
  }

  setup () {
    AppState.addEventListener('change', this.handleAppState.bind(this))
  }

  tearDown () {
    AppState.removeEventListener('change', this.handleAppState.bind(this))
  }
}
