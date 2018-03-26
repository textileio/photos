import TabNavigation from '../Navigation/TabNavigation'

export const reducer = (state, action) => {
  const newState = TabNavigation.router.getStateForAction(action, state)
  return newState || state
}
