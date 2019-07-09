import { InitializationState } from './reducer'
import { TextileInstanceState } from './models'

export function onboarded(state: InitializationState) {
  return state.onboarding.completed
}

export function initialized(state: InitializationState) {
  return state.instance.state === TextileInstanceState.initialized
}
