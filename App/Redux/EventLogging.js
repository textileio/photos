import { NavigationActions } from 'react-navigation'
import { getCurrentRouteName } from './CurrentRouteName'
import Analytics from 'appcenter-analytics'

const eventLogging = ({ getState }) => next => (action) => {
  if (
    action.type !== NavigationActions.NAVIGATE &&
    action.type !== NavigationActions.BACK
  ) {
    Analytics.trackEvent(action.type, {
      'action': action.text ? action.text : ''
    })
    return next(action)
  }

  const currentScreen = getCurrentRouteName(getState().nav)
  const result = next(action)
  const nextScreen = getCurrentRouteName(getState().nav)
  if (nextScreen !== currentScreen) {
    try {
      Analytics.trackEvent(action.type, { currentScreen, nextScreen })
      // Example: Analytics.trackEvent('user_navigation', {currentScreen, nextScreen})
    } catch (e) {
      Analytics.trackEvent('error', e)
    }
  }
  return result
}

export default eventLogging
