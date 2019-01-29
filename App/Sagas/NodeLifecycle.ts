import { delay, Task } from 'redux-saga'
import { Dispatch } from 'redux'
import { all, take, call, put, fork, cancelled, race, select } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import RNFS from 'react-native-fs'
import BackgroundTimer from 'react-native-background-timer'
import BackgroundFetch from 'react-native-background-fetch'
import Config from 'react-native-config'

import { TextileNodeSelectors } from '../Redux/TextileNodeRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import AccountActions from '../Redux/AccountRedux'
import { RootAction } from '../Redux/Types'
import * as TextileEvents from '../SDK/events'
import {
  newTextile,
  start,
  newWallet,
  walletAccountAt,
  initRepo,
  stop,
  WalletAccount,
  version,
  registerCafe,
  cafeSessions,
  CafeSession
 } from '@textile/react-native-sdk'

export const REPO_PATH = `${RNFS.DocumentDirectoryPath}/textile-go`
// const MIGRATION_NEEDED_ERROR = 'repo needs migration'
const INIT_NEEDED_ERROR = 'repo does not exist, initialization is required'
const LOG_LEVELS = (level: 'CRITICAL' | 'ERROR' | 'WARNING' | 'NOTICE' | 'INFO' | 'DEBUG') => JSON.stringify({
  'tex-broadcast': level,
  'tex-core': level,
  'tex-datastore': level,
  'tex-ipfs': level,
  'tex-mill': level,
  'tex-repo': level,
  'tex-repo-config': level,
  'tex-service': level
})

export function * manageNode () {
  while (true) {
    try {
      // Block until we get an active or background app state
      const action: ActionType<typeof TextileNodeActions.appStateChange> =
        yield take((action: RootAction) =>
          action.type === getType(TextileNodeActions.appStateChange) &&
          (action.payload.newState === 'active' || action.payload.newState === 'background' || action.payload.newState === 'backgroundFromForeground')
        )

      // Create an public event for appStateChange
      yield call(TextileEvents.appStateChange, action.payload.previousState, action.payload.newState)
      // Reqest to create and start the node no matter what, createAndStartNode below deals with ignoring simultaneious requests.
      yield put(TextileNodeActions.createNodeRequest())

      // If we got a background app state, start a background task and schedule the node to be stopped in 20 seconds
      //
      // This background state can come from a active > background transition
      // or by launching into the background because of a trigger.
      if (action.payload.newState === 'background' || action.payload.newState === 'backgroundFromForeground') {
        yield fork(backgroundTaskRace)
      }
    } catch (error) {
      // yield put(MockBridgeActions.newErrorMessage(error))
      yield call(TextileEvents.newErrorMessage, error)
      yield put(TextileNodeActions.nodeError(error))
    }
  }
}

export function * handleCreateNodeRequest (dispatch: Dispatch) {
  while (true) {
    // We take a request to create and start the node.
    // While we're processing that request, any additional requests will be ignored.
    yield take(getType(TextileNodeActions.createNodeRequest))

    // Fork the call to create and start the node so we don't block upstream saga manageNode
    const task: Task = yield fork(createAndStartNode, dispatch)

    // Don't take any other createNodeRequests until the forked task is done
    yield call(() => task.done)
  }
}

function * createAndStartNode(dispatch: Dispatch): any {
  try {
    yield put(TextileNodeActions.creatingNode())
    // TODO: put repo migration back in
    // const repoPathExists: boolean = yield call(RNFS.exists, REPO_PATH)
    // if (!repoPathExists) {
    //   yield call(RNFS.mkdir, REPO_PATH)
    //   yield call(moveTextileFiles)
    // }
    const logLevel = Config.RN_RELEASE_TYPE === 'production' ? 'ERROR' : 'DEBUG'
    yield call(newTextile, REPO_PATH, LOG_LEVELS(logLevel))
    yield put(TextileNodeActions.createNodeSuccess())
    yield put(TextileNodeActions.startingNode())
    yield call(start)
    const sessions: ReadonlyArray<CafeSession> = yield call(cafeSessions)
    if (sessions.length < 1) {
      const cafeOverride: string = Config.RN_TEXTILE_CAFE_OVERRIDE
      if (cafeOverride) {
        yield call(registerOverrideCafe, cafeOverride)
      } else {
        yield call(discoverAndRegisterCafes)
      }
    }

    yield put(TextileNodeActions.startNodeSuccess())
    yield call(TextileEvents.startNodeFinished)
    // yield put(MockBridgeActions.startNodeFinished())

  } catch (error) {
    try {
      // TODO: put migration back
      // if (error.message === MIGRATION_NEEDED_ERROR) {
      //   // instruct the node to export data to files
      //   yield call(migrateRepo, REPO_PATH)
      //   // store the fact there is a pending migration in the preferences redux persisted state
      //   yield put(MigrationActions.migrationNeeded())
      //   yield call(announcePeer)
      //   // call the create/start sequence again
      //   yield call(createAndStartNode, dispatch)
      // } else
      if (error.message === INIT_NEEDED_ERROR) {
        yield put(TextileNodeActions.creatingWallet())
        const recoveryPhrase: string = yield call(newWallet, 12)
        yield put(AccountActions.setRecoveryPhrase(recoveryPhrase))
        yield put(TextileNodeActions.derivingAccount())
        const walletAccount: WalletAccount = yield call(walletAccountAt, recoveryPhrase, 0)
        yield put(TextileNodeActions.initializingRepo())
        yield call(initRepo, walletAccount.seed, REPO_PATH, true)
        yield call(createAndStartNode, dispatch)
        yield put(AccountActions.initSuccess())
      } else {
        yield put(TextileNodeActions.nodeError(error))
      }
    } catch (error) {
      yield put(TextileNodeActions.nodeError(error))
    }
  }
}

// TODO: add repo migration back
// async function moveTextileFiles() {
//   const files = await RNFS.readDir(RNFS.DocumentDirectoryPath)
//   for (const file of files) {
//     if (file.path !== REPO_PATH && file.name !== 'RCTAsyncLocalStorage_V1') {
//       await RNFS.moveFile(file.path, `${REPO_PATH}/${file.name}`)
//     }
//   }
// }

// function * waitForOnline() {
//   const { onlineTimout } = yield race({
//     online: waitFor(select(TextileNodeSelectors.online)),
//     onlineTimout: call(delay, 10000)
//   })
//   if (onlineTimout) {
//     throw new Error('node online timed out, internet connection needed')
//   }
// }

function * registerOverrideCafe(url: string) {
  yield call(registerCafe, url)
}

function * discoverAndRegisterCafes() {
  const { cafes, timeout } = yield race({
    cafes: call(discoverCafes),
    timeout: call(delay, 10000)
  })
  if (timeout) {
    throw new Error('cafe discovery timed out, internet connection needed')
  }
  const discoveredCafes = cafes as DiscoveredCafes
  yield call(registerCafe, discoveredCafes.primary.url)
  yield call(registerCafe, discoveredCafes.secondary.url)
}

interface DiscoveredCafe {
  readonly peer: string
  readonly address: string
  readonly api: string
  readonly protocol: string
  readonly node: string
  readonly url: string
}
interface DiscoveredCafes {
  readonly primary: DiscoveredCafe
  readonly secondary: DiscoveredCafe
}

async function discoverCafes() {
  const response = await fetch(`${Config.RN_TEXTILE_CAFE_GATEWAY_URL}/cafes`, { method: 'GET' })
  if (response.status < 200 || response.status > 299) {
    throw new Error(`Status code error: ${response.statusText}`)
  }
  const discoveredCafes = await response.json() as DiscoveredCafes
  return discoveredCafes
}

function * backgroundTaskRace () {
  // This race cancels whichever effect looses the race, so a foreground event will cancel stopping the node
  //
  // Using the race effect, if we get a foreground event while we're waiting
  // to stop the node, cancel the stop and let it keep running
  yield call(BackgroundTimer.start)
  yield race({
    delayAndStopNode: call(stopNodeAfterDelay, 20000),
    foregroundEvent: take(
      (action: RootAction) =>
        action.type === getType(TextileNodeActions.appStateChange) && action.payload.newState === 'active'
    )
  })
  yield all([
    call(BackgroundTimer.stop),
    call(BackgroundFetch.finish, BackgroundFetch.FETCH_RESULT_NEW_DATA)
  ])

}

function * stopNodeAfterDelay (ms: number) {
  try {

    call(TextileEvents.stopNodeAfterDelayStarting)

    // Since node will go offline in 20s, do a final check for messages
    yield call(TextileNodeActions.refreshMessagesRequest)
    yield delay(ms * 0.5)
    yield call(TextileNodeActions.refreshMessagesRequest)
    yield delay(ms * 0.5)
  } finally {
    if (yield cancelled()) {
      yield call(TextileEvents.stopNodeAfterDelayCancelled)
    } else {
      yield call(TextileEvents.stopNodeAfterDelayFinishing)
      yield put(TextileNodeActions.stoppingNode())
      yield call(stop)
      yield call(TextileEvents.stopNodeAfterDelayComplete)
      yield put(TextileNodeActions.stopNodeSuccess())
      yield delay(500)
    }
  }
}

export function * getSDKVersion () {
  try {
    const v: string = yield call(version)
    yield put(TextileNodeActions.getSDKVersionSuccess(v))
  } catch (error) {
    yield put(TextileNodeActions.getSDKVersionError(error))
  }
}

export function * startBackgroundTask () {
  const currentState = yield select(TextileNodeSelectors.appState)
  // ensure we don't cause things in foreground
  if (currentState === 'background' || currentState === 'backgroundFromForeground') {
    yield put(TextileNodeActions.appStateChange(currentState, 'background'))
  }
}