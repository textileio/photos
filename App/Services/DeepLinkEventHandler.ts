import { Store } from 'redux'
import { Linking, Platform } from 'react-native'

import DeepLink from './DeepLink'

export default class DeepLinkEventHandler {
  constructor() {
    this.setup()
  }

  openUrl (url: string) {
    DeepLink.route(url)
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