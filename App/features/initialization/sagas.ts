import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import Textile from '@textile/react-native-sdk'

import { PreferencesSelectors } from '../../Redux/PreferencesRedux'
import AppConfig from '../../Config/app-config'
import { logNewEvent } from '../../Sagas/DeviceLogs'
import { accountActions } from '../account'

import * as actions from './actions'
import * as initializationSelectors from './selectors'

function* checkInitialization() {
  try {
    // Check if the persisted state already indicates that the Textile instance
    // is initialized
    const initialized = yield call(
      Textile.isInitialized,
      AppConfig.textileRepoPath
    )
    if (initialized) {
      const initializedInState = yield select(
        initializationSelectors.initialized
      )
      // If the instance is already initialized, but that is not reflected in the state
      // then fix that. This is important for a user that migrates to the new version
      // of the application whose Textile instance is already initialized.
      if (!initializedInState) {
        yield put(actions.nodeInitialized())
      }
      const verbose = yield select(PreferencesSelectors.verboseUi)
      yield call(Textile.launch, AppConfig.textileRepoPath, verbose)
    }
  } catch (error) {
    yield call(logNewEvent, 'checkInitialization', error.message, true)
  }
}

function* initializeTextileWithNewAccount(
  action: ActionType<typeof actions.initializeNewAccount>
) {
  try {
    const initialized = yield call(
      Textile.isInitialized,
      AppConfig.textileRepoPath
    )
    const verbose = yield select(PreferencesSelectors.verboseUi)
    if (!initialized) {
      const phrase = yield call(
        Textile.initializeCreatingNewWalletAndAccount,
        AppConfig.textileRepoPath,
        verbose,
        true
      )
      yield put(accountActions.setRecoveryPhrase(phrase))
    }
    yield put(actions.nodeInitialized())
    yield put(actions.chooseOnboardingPath('newAccount'))
    yield call(Textile.launch, AppConfig.textileRepoPath, verbose)
  } catch (error) {
    yield put(actions.failedToInitializeNode(error))
  }
}

function* initializeTextileWithAccountSeed(
  action: ActionType<typeof actions.initializeExistingAccount>
) {
  const { seed } = action.payload
  try {
    const initialized = yield call(
      Textile.isInitialized,
      AppConfig.textileRepoPath
    )
    const verbose = yield select(PreferencesSelectors.verboseUi)
    if (!initialized) {
      yield call(
        Textile.initialize,
        AppConfig.textileRepoPath,
        seed,
        verbose,
        true
      )
    }
    yield put(actions.nodeInitialized())
    yield put(actions.chooseOnboardingPath('existingAccount'))
    yield call(Textile.launch, AppConfig.textileRepoPath, verbose)
  } catch (error) {
    yield put(actions.failedToInitializeNode(error))
  }
}

export default function*() {
  yield all([
    call(checkInitialization),
    takeEvery(
      getType(actions.initializeNewAccount),
      initializeTextileWithNewAccount
    ),
    takeEvery(
      getType(actions.initializeExistingAccount),
      initializeTextileWithAccountSeed
    )
  ])
}
