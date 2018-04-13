import { NavigationActions } from 'react-navigation'
import { getCurrentRouteName } from './CurrentRouteName'

const screenTracking = ({ getState }) => next => (action) => {
  if (
    action.type !== NavigationActions.NAVIGATE &&
    action.type !== NavigationActions.BACK
  ) {
    return next(action)
  }

  const currentScreen = getCurrentRouteName(getState().nav)
  const result = next(action)
  const nextScreen = getCurrentRouteName(getState().nav)
  if (nextScreen !== currentScreen) {
    try {
      console.tron.log(`NAVIGATING ${currentScreen} to ${nextScreen}`)
      // Example: Analytics.trackEvent('user_navigation', {currentScreen, nextScreen})
    } catch (e) {
      console.tron.log(e)
    }
  }
  return result
}

export default screenTracking
