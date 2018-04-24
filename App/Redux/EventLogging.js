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
    let payload = { deviceId }
    const additionalPayload = actionToPayload(action)
    if (additionalPayload) {
      payload = {...payload, ...additionalPayload}
    }
    // console.log('ACTION:', action.type, 'PAYLOAD:', payload)
    Analytics.trackEvent(action.type, payload)
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

const actionToPayload = (action) => {
  switch (action.type) {
    case 'APP_STATE_CHANGE':
      return { description: action.newState }
    case 'IMAGE_ADDED':
      return { description: action.remotePayloadPath }
    case 'IMAGE_UPLOAD_PROGRESS':
      return { description: action.data.file }
    case 'IMAGE_UPLOAD_COMPLETE':
      return { description: action.data.file }
    case 'IMAGE_UPLOAD_ERROR':
      return { description: action.data.file, error: action.data.error.message }
    case 'CREATE_NODE_FAILURE':
      return { error: action.error.message }
    case 'START_GATEWAY_FAILURE':
      return { error: action.error.message }
    case 'START_NODE_FAILURE':
      return { error: action.error.message }
    case 'STOP_NODE_FAILURE':
      return { error: action.error.message }
    case 'PHOTOS_TASK_ERROR':
      return { error: action.error.message }
    default:
      return null
  }
}

export default eventLogging
