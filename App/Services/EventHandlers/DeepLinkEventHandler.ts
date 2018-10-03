import { Linking, Platform } from 'react-native'
import { Store } from 'redux'
import { RootState } from '../../Redux/Types'
import UIActions from '../../Redux/UIRedux'

export default class DeepLinkEventHandler {
  store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  handleIOS (event: any) {
    this.handleUrl(event.url)
  }

  handleUrl (url: string) {
    if (url) {
      this.store.dispatch(UIActions.routeDeepLinkRequest(url))
    }
  }

  setup () {
    Linking.addEventListener('url', this.handleIOS.bind(this))
    Linking.getInitialURL().then(this.handleUrl.bind(this))
  }

  tearDown () {
    if (Platform.OS !== 'android') {
      Linking.removeEventListener('url', this.handleIOS)
    }
  }
}
