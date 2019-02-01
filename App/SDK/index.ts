import { DeviceEventEmitter, AppState } from 'react-native'
import * as API from '@textile/react-native-sdk'
import {
  WalletAccount
 } from '@textile/react-native-sdk'
import TextileStore from './store'
import TextileMigration from './migration'
import * as TextileEvents from './events'
import { NodeState } from './types'
import { getHMS, createTimeout } from './helpers'
import { delay } from 'redux-saga'
import BackgroundTimer from 'react-native-background-timer'
import BackgroundFetch from 'react-native-background-fetch'
import RNFS from 'react-native-fs'

import { ICafeSessions, ICafeSession } from '@textile/react-native-protobufs'

import {
  DiscoveredCafes,
  TextileAppStateStatus,
  TextileOptions
} from './types'

const packageFile = require('./../../package.json')
export const VERSION = packageFile.version

const MIGRATION_NEEDED_ERROR = 'repo needs migration'
const INIT_NEEDED_ERROR = 'repo does not exist, initialization is required'

export interface TextileConfig {
  RELEASE_TYPE: string
  TEXTILE_CAFE_GATEWAY_URL: string
  TEXTILE_CAFE_OVERRIDE: string
}
class Textile {
  // Temp instance of the app's redux store while I remove deps to it
  api: any
  migration = new TextileMigration()
  _debug = false
  _store = new TextileStore()

  _config: TextileConfig = {
    RELEASE_TYPE: 'development',
    TEXTILE_CAFE_GATEWAY_URL: '',
    TEXTILE_CAFE_OVERRIDE: ''
  }
  _initialized = false

  repoPath = `${RNFS.DocumentDirectoryPath}/textile-go`

  constructor(options: TextileOptions) {
    if (options.debug) {
      this._debug = true
    }
    this.api = API
    console.info('Initializing @textile/react-native-sdk v. ' + VERSION)
  }

  /* ---- Functions to wire into app ------ */
  backgroundFetch () {
    this.startBackgroundTask()
  }
  locationUpdate () {
    this.startBackgroundTask()
  }

  // De-register the listeners
  tearDown() {
    // Clear on out too if detected to help speed up any startup time
    // Clear all our listeners
    this.api.Events.removeAllListeners()
    DeviceEventEmitter.removeAllListeners()
  }

  // setup should only be run where the class will remain persistent so that
  // listeners will be wired in to one instance only,
  setup(config?: TextileConfig) {
    // if config provided, set it
    if (config) {
      this._config = config
    }
    // Clear storage to fresh state
    this._store.clear()
    // Clear state on setup
    // Setup our within sdk listeners
    this.api.Events.addListener('onOnline', () => {
      this._store.setNodeOnline(true)
    })

    DeviceEventEmitter.addListener('@textile/createAndStartNode', (payload) => {
      this.createAndStartNode()
    })

    DeviceEventEmitter.addListener('@textile/appNextState', (payload) => {
      this.nextAppState(payload.nextState)
    })

    this.initializeAppState()

    this._initialized = true
  }

  isInitializedCheck = () => {
    if (!this._initialized) {
      TextileEvents.nonInitializedError()
      throw new Error('Attempt to call a Textile instance method on an uninitialized instance')
    }
  }

  /* ---- STATE BASED METHODS ----- */
  //  All methods here should only be called as the result of a sequenced kicked off
  //  By an event and detected by the persistent instance that executed setup()

  initializeAppState = async () => {
    const defaultAppState = 'default' as TextileAppStateStatus
    // if for some reason initialized will ever be called from a non-blank state (?), we need the below
    // const storedState = await this._store.getAppState()
    // let defaultAppState = 'default' as TextileAppStateStatus
    // if (storedState) {
    //   defaultAppState = JSON.parse(storedState) as TextileAppStateStatus
    // }
    // wait just a moment in case we beat native state
    await delay(10)
    const currentAppState = AppState.currentState
    const queriedAppState = currentAppState || 'unknown'
    await this.appStateChange(defaultAppState, queriedAppState)
  }

  startBackgroundTask = async () => {
    const currentState = await this.appState()
    // const currentState = yield select(TextileNodeSelectors.appState)
    // ensure we don't cause things in foreground
    if (currentState === 'background' || currentState === 'backgroundFromForeground') {
      await this.appStateChange(currentState, 'background')
    }
  }
  createAndStartNode = async () => {
    // TODO
    /* In redux/saga world, we did a // yield call(() => task.done) to ensure this wasn't called
    while already running. Do we need the same check to ensure it doesn't happen here?
    */
    this.isInitializedCheck()
    const debug = this._config.RELEASE_TYPE !== 'production'
    try {
      await this.updateNodeState(NodeState.creating)
      const needsMigration = await this.migration.requiresFileMigration(this.repoPath)
      if (needsMigration) {
        await this.migration.runFileMigration(this.repoPath)
      }
      await this.api.newTextile(this.repoPath, debug)

      await this.updateNodeState(NodeState.created)
      await this.updateNodeState(NodeState.starting)

      await this.api.start()

      const sessions: ICafeSessions = await this.api.cafeSessions()
      if (!sessions || !sessions.values || sessions.values.length < 1) {
        const cafeOverride: string = this._config.TEXTILE_CAFE_OVERRIDE
        if (cafeOverride) {
          await this.api.registerCafe(cafeOverride)
        } else {
          await this.discoverAndRegisterCafes()
        }
      }
      await this.updateNodeState(NodeState.started)
      TextileEvents.startNodeFinished()
    } catch (error) {
      try {
        if (error.message === MIGRATION_NEEDED_ERROR) {
          // instruct the node to export data to files
          await this.api.migrateRepo(this.repoPath)
          // store the fact there is a pending migration in the preferences redux persisted state
          TextileEvents.migrationNeeded()
          // call the create/start sequence again
          TextileEvents.createAndStartNode()
        } else if (error.message === INIT_NEEDED_ERROR) {
          await this.updateNodeState(NodeState.creatingWallet)
          const recoveryPhrase: string = await this.api.newWallet(12)
          TextileEvents.setRecoveryPhrase(recoveryPhrase)
          await this.updateNodeState(NodeState.derivingAccount)
          const walletAccount: WalletAccount = await this.api.walletAccountAt(recoveryPhrase, 0)
          await this.updateNodeState(NodeState.initializingRepo)
          await this.api.initRepo(walletAccount.seed, this.repoPath, true, debug)
          TextileEvents.createAndStartNode()
          TextileEvents.walletInitSuccess()
        } else {
          await this.updateNodeStateError(error)
        }
      } catch (error) {
        await this.updateNodeStateError(error)
      }
    }
  }

  manageNode = async (previousState: TextileAppStateStatus, newState: TextileAppStateStatus) => {
    this.isInitializedCheck()
    if (newState === 'active' || newState === 'background' || newState === 'backgroundFromForeground') {
      await TextileEvents.appStateChange(previousState, newState)
      this.createAndStartNode()
      if (newState === 'background' || newState === 'backgroundFromForeground') {
        await this.backgroundTaskRace()
      }
    }
  }

  discoverAndRegisterCafes = async () => {
    if (!this._initialized) {
      TextileEvents.nonInitializedError()
      return
    }
    try {
      const cafes = await createTimeout(10000, this.discoverCafes())
      const discoveredCafes = cafes as DiscoveredCafes
      await this.api.registerCafe(discoveredCafes.primary.url)
      await this.api.registerCafe(discoveredCafes.secondary.url)
    } catch (error) {
      // When this happens, you should retry the discover and register...
      TextileEvents.newError('cafeDiscoveryError', 'cafe discovery timed out, internet connection needed')
    }
  }

  /* ----- STATE FREE PUBLIC SELECTORS ----- */
  appState = async (): Promise<TextileAppStateStatus> => {
    const storedState = await this._store.getAppState()
    const currentState = storedState || 'unknown' as TextileAppStateStatus
    return currentState
  }

  nodeOnline = async (): Promise<boolean> => {
    const online = await this._store.getNodeOnline()
    return !!online // store can return void, in which case default return false
  }

  nodeState = async (): Promise<NodeState> => {
    const storedState = await this._store.getNodeState()
    if (!storedState) {
      return NodeState.nonexistent
    }
    return storedState.state
  }
  getCafeSessions = async (): Promise<ReadonlyArray<ICafeSession>> => {
    const sessions: Readonly<ICafeSessions> = await this.api.cafeSessions()
    if (!sessions) {
      return []
    }
    const values: ReadonlyArray<ICafeSession> | undefined | null = sessions.values
    if (!values) {
      return []
    } else {
      return values
    }
  }

  getRefreshedCafeSessions = async (): Promise<ReadonlyArray<ICafeSession>> => {
    const sessions: Readonly<ICafeSessions> = await this.api.cafeSessions()
    if (!sessions) {
      return []
    }
    const values: ReadonlyArray<ICafeSession> | undefined | null = sessions.values
    if (!values) {
      return []
    } else {
      const refreshedValues: ReadonlyArray<ICafeSession> = await Promise.all(
        values.map(async (session) => await this.api.refreshCafeSession(session.id!))
      )
      return refreshedValues
    }
  }

  /* ------ INTERNAL METHODS ----- */
  private discoverCafes = async () => {
    if (!this._initialized) {
      TextileEvents.nonInitializedError()
      return
    }
    const response = await fetch(`${this._config.TEXTILE_CAFE_GATEWAY_URL}/cafes`, { method: 'GET' })
    if (response.status < 200 || response.status > 299) {
      throw new Error(`Status code error: ${response.statusText}`)
    }
    const discoveredCafes = await response.json() as DiscoveredCafes
    return discoveredCafes
  }

  private updateNodeStateError = async (error: Error) => {
    const storedState = await this._store.getNodeState()
    const state = storedState ? storedState.state : NodeState.nonexistent
    await this._store.setNodeState({state, error: error.message})
  }
  private nextAppState = async (nextState: TextileAppStateStatus) => {
    this.isInitializedCheck()
    const previousState = await this.appState()
        // const currentState = this.store.getState().textileNode.appState
    const newState: TextileAppStateStatus = nextState === 'background' && (previousState === 'active' || previousState === 'inactive') ? 'backgroundFromForeground' : nextState
    if (newState !== previousState || newState === 'background') {
      await this.appStateChange(previousState, newState)
    }
  }
  private appStateChange = async (previousState: TextileAppStateStatus, nextState: TextileAppStateStatus) => {
    this.isInitializedCheck()
    await this._store.setAppState(nextState)
    const appStateUpdate = getHMS()
    await this.manageNode(previousState, nextState)
  }
  private updateNodeState = async (state: NodeState) => {
    this.isInitializedCheck()
    await this._store.setNodeState({state})
    TextileEvents.newNodeState(state)
  }

  /* ----- PRIVATE - EVENT EMITTERS ----- */

  private backgroundTaskRace = async () => {
    // This race cancels whichever effect looses the race, so a foreground event will cancel stopping the node
    //
    // Using the race effect, if we get a foreground event while we're waiting
    // to stop the node, cancel the stop and let it keep running
    await BackgroundTimer.start()
    const ms = 20000
    let cancelled = false

    const foregroundEvent = DeviceEventEmitter.addListener('@textile/appNextState', (payload) => {
      if (payload.nextState === 'active' && !cancelled) {
        TextileEvents.stopNodeAfterDelayCancelled()
        cancelled = true
      }
    })

    cancelSequence:
    while (!cancelled) {
        TextileEvents.stopNodeAfterDelayStarting()
        await this.api.checkCafeMessages() // do a quick check for new messages
        await delay(ms / 2)
        if (cancelled) { // cancelled by event, so abort sequence
          foregroundEvent.remove() // remove our event listener
          break cancelSequence
        }
        await this.api.checkCafeMessages()
        await delay(ms / 2)
        if (cancelled) { // cancelled by event, so abort sequence
          foregroundEvent.remove() // remove our event listener
          break cancelSequence
        }
        // enter stopping sequence
        foregroundEvent.remove() // remove our event listener
        TextileEvents.stopNodeAfterDelayFinishing()
        await this.stopNode() // stop the node
        cancelled = true // be sure to exit the loop
    }

    await BackgroundTimer.stop()
    await BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA)
  }

  private stopNode = async () => {
    this._store.setNodeOnline(false)
    this._store.setNodeState({state: NodeState.stopping})
    await this.api.stop()
    this._store.setNodeState({state: NodeState.stopped})
  }
}

export { Textile, API }
export default new Textile({})
