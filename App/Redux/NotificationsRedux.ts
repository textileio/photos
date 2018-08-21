import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  refreshNotificationsRequest: createAction('REFRESH_NOTIFICATIONS_REQUEST', resolve => {
    return () => resolve()
  }),
  refreshNotificationsSuccess: createAction('REFRESH_NOTIFICATIONS_SUCCESS', resolve => {
    return (notifications: TextileTypes.Notification[]) => resolve({notifications})
  }),
  refreshNotificationsFailure: createAction('REFRESH_NOTIFICATIONS_FAILURE', resolve => {
    return () => resolve()
  }),
  newNotificationRequest: createAction('NEW_NOTIFICATION_REQUEST', resolve => {
    return (notification: TextileTypes.Notification) => resolve({notification})
  }),
  notificationEngagement: createAction('NOTIFICATION_ENGAGEMENT', resolve => {
    return (engagement: TextileTypes.NotificationEngagement) => resolve({ engagement: engagement })
  }),
  notificationSuccess: createAction('NOTIFICATION_SUCCESS', resolve => {
    return (notification: TextileTypes.Notification) => resolve({ notification })
  }),
  notificationFailure: createAction('NOTIFICATION_FAILURE', resolve => {
    return (notification: TextileTypes.Notification) => resolve({ notification })
  })
}

export type NotificationsAction = ActionType<typeof actions>

export type NotificationsState = {
  readonly notifications: Array<TextileTypes.Notification>,
  refreshing: boolean
}

export const initialState: NotificationsState = {
  notifications: [],
  refreshing: false
}

export function reducer (state: NotificationsState = initialState, action: NotificationsAction): NotificationsState {
  switch (action.type) {
    case getType(actions.refreshNotificationsRequest):
      return { ...state, refreshing: true }
    case getType(actions.refreshNotificationsSuccess):
      // Add it to our list for display
      const notifications = action.payload.notifications
      return { ...state, notifications, refreshing: false }
    case getType(actions.refreshNotificationsFailure):
      return { ...state, refreshing: false }
    default:
      return state
  }
}

export const NotificationsSelectors = {
}

export default actions
