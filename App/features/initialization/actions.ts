import { createAction } from 'typesafe-actions'
import { OnboardingPath } from './models'

export const initializeNewAccount = createAction(
  'initialization/INITIALIZE_CREATING_NEW_WALLET_AND_ACCOUNT'
)

export const initializeExistingAccount = createAction(
  'initialization/INITIALIZE_WITH_EXISTING_ACCOUNT_SEED',
  resolve => {
    return (seed: string) => resolve({ seed })
  }
)

export const nodeInitialized = createAction('initialization/NODE_INITIALIZED')

export const failedToInitializeNode = createAction(
  'initialization/FAILED_TO_INITIALIZE_NODE',
  resolve => {
    return (error: any) => resolve({ error })
  }
)

export const chooseOnboardingPath = createAction(
  'initialization/CHOOSE_ONBOARDING_PATH',
  resolve => {
    return (path: OnboardingPath) => resolve({ path })
  }
)

export const setCurrentPage = createAction(
  'initialization/SET_CURRENT_PAGE_ONBOARDING',
  resolve => {
    return (page: number) => resolve({ page })
  }
)

export const nextPage = createAction('initialization/NEXT_PAGE_ONBOARDING')

export const onboardingSuccess = createAction(
  'initialization/COMPLETE_ONBOARDING'
)
