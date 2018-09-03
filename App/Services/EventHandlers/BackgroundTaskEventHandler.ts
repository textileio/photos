import { Store } from 'redux'
import BackgroundTask from 'react-native-background-task'

import { RootState } from '../../Redux/Types'

import TriggersActions from '../../Redux/TriggersRedux'

export default class BackgroundTaskEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  schedule () {
    BackgroundTask.schedule({})
  }

  setup () {
    BackgroundTask.define(() => {
      this.store.dispatch(TriggersActions.backgroundTask())
    })
  }

  tearDown () {
  }
}
