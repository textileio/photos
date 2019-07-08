import { createAction } from 'typesafe-actions'

export const initializeNewAccount = createAction(
  'INITIALIZE_CREATING_NEW_WALLET_AND_ACCOUNT',
  resolve => {
    return () => resolve()
  }
)

export const initializeExistingAccount = createAction(
  'INITIALIZE_WITH_EXISTING_ACCOUNT_SEED',
  resolve => {
    return (seed: string) => resolve({ seed })
  }
)

export const nodeInitialized = createAction('NODE_INITIALIZED', resolve => {
  return () => resolve()
})

export const failedToInitializeNode = createAction(
  'FAILED_TO_INITIALIZE_NODE',
  resolve => {
    return (error: any) => resolve({ error })
  }
)

export const chooseOnboardingPath = createAction(
  'CHOOSE_ONBOARDING_PATH',
  resolve => {
    return (path: string) => resolve({ path })
  }
)

export const setCurrentPage = createAction(
  'SET_CURRENT_PAGE_ONBOARDING',
  resolve => {
    return (page: number) => resolve({ page })
  }
)

export const nextPage = createAction('NEXT_PAGE_ONBOARDING', resolve => {
  return () => resolve()
})

export const onboardingSuccess = createAction(
  'COMPLETE_ONBOARDING',
  resolve => {
    return () => resolve()
  }
)
