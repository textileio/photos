import { NativeModules, NativeEventEmitter, DeviceEventEmitter, Platform } from 'react-native'
import {  Events,
          Update,
          ThreadUpdate,
          BlockType,
          NotificationInfo,
          version
} from '@textile/react-native-sdk'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import { Store, AnyAction } from 'redux'
import { RootState } from '../Redux/Types'

const packageFile = require('./../../package.json')
export const VERSION = packageFile.version

export interface TextileOptions {
  debug?: boolean
}

function getHMS() {
  const now = new Date()
  return [
    now.getHours().toString(),
    now.getMinutes().toString(),
    now.getSeconds().toString()
  ].join(':')
}

class Textile {
  api: API
  _debug = false

  constructor(options: TextileOptions) {
    if (options.debug) {
      this._debug = true
    }
    this.api = new API()
    console.info('Initializing @textile/react-native-sdk v. ' + VERSION)
  }
  setup(store: Store<RootState, AnyAction> & { dispatch: {}; }) {
    // Clear state on setup
    // Setup our within sdk listeners
    Events.addListener('onOnline', () => {
      store.dispatch(TextileNodeActions.nodeOnline())
    })
  }
  tearDown() {
    // Clear on out too if detected to help speed up any startup time
    // Clear all our listeners
    Events.removeAllListeners()
  }

}

class API {
  static get version () {
    return (async () => await version())()
  }
}

export { Textile, API }
export default new Textile({})
