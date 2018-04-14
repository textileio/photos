import { NavigationActions } from 'react-navigation'
import { getCurrentRouteName } from './CurrentRouteName'
import Analytics from 'appcenter-analytics'
import {getUniqueID} from 'react-native-device-info'

const deviceId = getUniqueID()

const eventLogging = ({ getState }) => next => (action) => {
  if (
    action.type !== NavigationActions.NAVIGATE &&
    action.type !== NavigationActions.BACK
  ) {
    Analytics.trackEvent(action.type, {
      action: action.text ? action.text : '',
      deviceId
    })
    return next(action)
  }

  const currentScreen = getCurrentRouteName(getState().nav)
  const result = next(action)
  const nextScreen = getCurrentRouteName(getState().nav)
  if (nextScreen !== currentScreen) {
    try {
      Analytics.trackEvent(action.type, { currentScreen, nextScreen, deviceId })
      // Example: Analytics.trackEvent('user_navigation', {currentScreen, nextScreen})
    } catch (error) {
      Analytics.trackEvent('error', { error, deviceId })
    }
  }
  return result
}

export default eventLogging
