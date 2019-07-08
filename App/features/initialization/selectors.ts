import { RootState } from '../../Redux/Types'
import { TextileInstanceState } from './models'

export const onboarded = (state: RootState) => {
  return state.initialization.onboarding.completed
}

export const initialized = (state: RootState) => {
  return (
    state.initialization.instance.state === TextileInstanceState.initialized
  )
}
