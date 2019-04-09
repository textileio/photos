import { Linking, Platform } from 'react-native'
import { Store } from 'redux'
import { RootState } from '../../Redux/Types'
import UIActions from '../../Redux/UIRedux'

export default class DeepLinkEventHandler {
  public store: Store<RootState>

  constructor(store: Store<RootState>) {
    this.store = store
    this.setup()
  }

  public handleIOS(event: any) {
    this.handleUrl(event.url)
  }

  public handleUrl(url: string) {
    if (url) {
      this.store.dispatch(UIActions.routeDeepLinkRequest(url))
    }
  }

  public setup() {
    Linking.addEventListener('url', this.handleIOS.bind(this))
    Linking.getInitialURL().then(this.handleUrl.bind(this))
  }

  public tearDown() {
    if (Platform.OS !== 'android') {
      Linking.removeEventListener('url', this.handleIOS)
    }
  }
}
