import { InitializationState } from './reducer'

export function onboarded(state: InitializationState) {
  return state.onboarding.completed
}

export function initialized(state: InitializationState) {
  return state.instance.state === 'initialized'
}

export function processing(state: InitializationState) {
  return (
    state.instance.state !== 'uninitialized' &&
    state.instance.state !== 'initialized'
  )
}

export function initializationDescription(state: InitializationState) {
  switch (state.instance.state) {
    case 'uninitialized':
      return 'Pending initialization'
    case 'creatingWallet':
      return 'Creating your Textile wallet'
    case 'creatingAccount':
      return 'Creating your account'
    case 'initialized':
      return 'Initialization complete'
  }
}
