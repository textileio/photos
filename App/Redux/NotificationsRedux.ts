import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  refreshNotificationsRequest: createAction('REFRESH_NOTIFICATIONS_REQUEST', resolve => {
    return () => resolve()
  }),
  refreshNotificationsSuccess: createAction('REFRESH_NOTIFICATIONS_SUCCESS', resolve => {
    return (notifications: TextileTypes.Notification[]) => resolve({notifications})
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
  readonly notifications: Array<TextileTypes.Notification>
}

export const initialState: NotificationsState = {
  notifications: []
}

export function reducer (state: NotificationsState = initialState, action: NotificationsAction): NotificationsState {
  switch (action.type) {
    case getType(actions.refreshNotificationsSuccess):
      // Add it to our list for display
      const notifications = action.payload.notifications
      return { ...state, notifications }
    default:
      return state
  }
}

export const NotificationsSelectors = {
}

export default actions
