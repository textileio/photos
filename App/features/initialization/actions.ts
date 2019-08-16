import { createAction } from 'typesafe-actions'
import { InitializationStatus, InitializationPath } from './models'

export const initializeNewAccount = createAction(
  'initialization/INITIALIZE_CREATING_NEW_WALLET_AND_ACCOUNT'
)

export const initializeExistingAccount = createAction(
  'initialization/INITIALIZE_WITH_EXISTING_ACCOUNT_SEED',
  resolve => {
    return (seed: string) => resolve({ seed })
  }
)

export const updateInitializationStatus = createAction(
  'initialization/UPDATE_INITIALIZATION_STATUS',
  resolve => {
    return (status: InitializationStatus) => resolve({ status })
  }
)

export const failedToInitializeNode = createAction(
  'initialization/FAILED_TO_INITIALIZE_NODE',
  resolve => {
    return (error: any) => resolve({ error })
  }
)

export const chooseInitializationPath = createAction(
  'initialization/CHOOSE_INITIALIZATION_PATH',
  resolve => {
    return (path?: InitializationPath) => resolve({ path })
  }
)
