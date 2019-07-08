import { InitializationState } from './reducer'
import { TextileInstanceState } from './models'

export const onboarded = (state: InitializationState) => {
  return state.onboarding.completed
}

export const initialized = (state: InitializationState) => {
  return state.instance.state === TextileInstanceState.initialized
}
