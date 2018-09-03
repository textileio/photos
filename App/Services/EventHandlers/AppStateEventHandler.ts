import { Store } from 'redux'
import { AppState, AppStateStatus } from 'react-native'

import { RootState } from '../../Redux/Types'

import TextileNodeActions from '../../Redux/TextileNodeRedux'

export default class AppStateEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  handleAppState (newState: AppStateStatus) {
    const currentState = this.store.getState().textileNode.appState
    if (newState !== currentState) {
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
