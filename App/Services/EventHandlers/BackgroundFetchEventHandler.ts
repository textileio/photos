import { Store } from 'redux'
import BackgroundFetch from 'react-native-background-fetch'

import { RootState } from '../../Redux/Types'

import TriggersActions from '../../Redux/TriggersRedux'

export default class BackgroundFetchEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  setup () {
    BackgroundFetch.configure({}, () => {
      this.store.dispatch(TriggersActions.backgroundFetch())
    }, (error) => {
    })
  }

  tearDown () {
  }
}
