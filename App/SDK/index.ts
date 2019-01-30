import { NativeModules, NativeEventEmitter, DeviceEventEmitter, Platform, AppState } from 'react-native'
import Config from 'react-native-config'
import * as API from '@textile/react-native-sdk'
import TextileNodeActions, { TextileAppStateStatus } from '../Redux/TextileNodeRedux'
import NodeLifecycle from '../Sagas/NodeLifecycle'
import { Store, AnyAction } from 'redux'
import { RootState } from '../Redux/Types'
import TextileStore from './store'
import * as TextileEvents from './events'
import { delay } from 'redux-saga'
import BackgroundTimer from 'react-native-background-timer'

import {
  DiscoveredCafe,
  DiscoveredCafes
} from './types'

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
  // Temp instance of the app's redux store while I remove deps to it
  _reduxStore?: Store<RootState, AnyAction> & { dispatch: {}; }
  api: any
  _debug = false
  _store = new TextileStore()

  constructor(options: TextileOptions) {
    if (options.debug) {
      this._debug = true
    }
    this.api = API
    console.info('Initializing @textile/react-native-sdk v. ' + VERSION)
  }

  setup(store: Store<RootState, AnyAction> & { dispatch: {}; }) {
    // Clear state on setup
    // Setup our within sdk listeners
    this.api.Events.addListener('onOnline', () => {
      store.dispatch(TextileNodeActions.nodeOnline())
    })

    DeviceEventEmitter.addListener('@textile/appNextState', (payload) => {
      this.nextAppState(payload.nextState)
    })

    this._reduxStore = store

    this.initializeAppState()
  }
  tearDown() {
    // Clear on out too if detected to help speed up any startup time
    // Clear all our listeners
    this.api.Events.removeAllListeners()
    DeviceEventEmitter.removeAllListeners()
  }

  backgroundFetch () {
    NodeLifecycle.startBackgroundTask()
  }
  locationUpdate () {
    NodeLifecycle.startBackgroundTask()
  }

  initializeAppState = async () => {
    // wait just a moment in case we beat native state
    const defaultAppState = 'default' as TextileAppStateStatus
    // if for some reason initialized will ever be called from a non-blank state, we need the below
    // const storedState = await this._store.getAppState()
    // let defaultAppState = 'default' as TextileAppStateStatus
    // if (storedState) {
    //   defaultAppState = JSON.parse(storedState) as TextileAppStateStatus
    // }
    await delay(10)
    const currentAppState = AppState.currentState
    const queriedAppState = currentAppState || 'unknown'
    await this.appStateChange(defaultAppState, queriedAppState)
  }

  nextAppState = async (nextState: TextileAppStateStatus) => {
    const previousState = await this.appState()
        // const currentState = this.store.getState().textileNode.appState
    const newState: TextileAppStateStatus = nextState === 'background' && (previousState === 'active' || previousState === 'inactive') ? 'backgroundFromForeground' : nextState
    if (newState !== previousState || newState === 'background') {
      await this.appStateChange(previousState, newState)
    }
  }

  appStateChange = async (previousState: TextileAppStateStatus, nextState: TextileAppStateStatus) => {
    await this._store.setAppState(nextState)
    const appStateUpdate = getHMS()
    await this.manageNode(previousState, nextState)
  }
  manageNode = async (previousState: TextileAppStateStatus, newState: TextileAppStateStatus) => {
    console.log('axh statechange', previousState, newState)
    if (newState === 'active' || newState === 'background' || newState === 'backgroundFromForeground') {

      // try {
      await TextileEvents.appStateChange(previousState, newState)
      if (this._reduxStore) {
        this._reduxStore.dispatch(TextileNodeActions.createNodeRequest())
      }
      if (newState === 'background' || newState === 'backgroundFromForeground') {
        // TODO
        // fork(backgroundTaskRace)
      }
      // } catch (error) {
      //   // yield put(MockBridgeActions.newErrorMessage(error))
      //   yield call(TextileEvents.newErrorMessage, error)
      //   yield put(TextileNodeActions.nodeError(error))
      // }

    }
  }

  timeout(ms: number, promise: Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, ms)
      promise.then(resolve, reject)
    })
  }

  discoverAndRegisterCafes = async () => {
    console.log('axh getting cafes')
    // const { cafes, timeout } = yield race({
    //   cafes: call(discoverCafes),
    //   timeout: call(delay, 10000)
    // })
    // if (timeout) {
    //   throw new Error('cafe discovery timed out, internet connection needed')
    // }
    // const discoveredCafes = cafes as DiscoveredCafes
    // yield call(registerCafe, discoveredCafes.primary.url)
    // yield call(registerCafe, discoveredCafes.secondary.url)

    try {
      const cafes = await this.timeout(10000, this.discoverCafes())
      const discoveredCafes = cafes as DiscoveredCafes
      console.log('axh registering cafes')
      await this.api.registerCafe(discoveredCafes.primary.url)
      await this.api.registerCafe(discoveredCafes.secondary.url)
      console.log('axh success cafes')
    } catch (error) {
      console.log('axh cafe error', error)
      // throw new Error('cafe discovery timed out, internet connection needed')
    }
  }

  discoverCafes = async () => {
    const response = await fetch(`${Config.RN_TEXTILE_CAFE_GATEWAY_URL}/cafes`, { method: 'GET' })
    if (response.status < 200 || response.status > 299) {
      throw new Error(`Status code error: ${response.statusText}`)
    }
    const discoveredCafes = await response.json() as DiscoveredCafes
    return discoveredCafes
  }

  /* ----- SELECTORS ----- */
  appState = async (): Promise<TextileAppStateStatus> => {
    const storedState = await this._store.getAppState()
    let currentState = 'unknown' as TextileAppStateStatus
    if (storedState) {
      currentState = JSON.parse(storedState) as TextileAppStateStatus
    }
    return currentState
  }

  nodeStatus = async (): Promise<string> => {
    await delay(10)
    return 'startedX'
  }
}

export { Textile, API }
export default new Textile({})
