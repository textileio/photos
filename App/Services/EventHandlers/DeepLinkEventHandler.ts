import { Store } from 'redux'
import { Linking, Platform } from 'react-native'

import TriggersActions from '../../Redux/TriggersRedux'
import {RootState} from '../../Redux/Types'

export default class DeepLinkEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  openUrl (url: string) {
    this.store.dispatch(TriggersActions.routeDeepLinkRequest(url))
  }

  setup () {
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.openUrl(url)
      })
    } else {
      Linking.addEventListener('url', event => {
        this.openUrl(event.url)
      })
    }
  }

  tearDown () {

  }
}
