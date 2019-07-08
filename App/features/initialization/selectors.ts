import { RootState } from '../../Redux/Types'

export const onboarded = (state: RootState) => {
  return state.initialization.onboarding.completed
}
