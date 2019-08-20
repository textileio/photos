import { createAction, createAsyncAction } from 'typesafe-actions'
import { Notification, InviteReceivedNotification, LocalAlertType } from './models'
import { PushNotification } from '../../Services/EventHandlers/NotificationEventHandler'

export const getUpdatesRequest = createAction('updates/GET_UPDATES_REQUEST')

export const readAllNotificationsRequest = createAction(
  'CLEAR_ALL_NOTIFICATIONS_REQUEST',
  resolve => {
    return () => resolve()
  }
)

export const refreshNotificationsRequest = createAction(
  'REFRESH_NOTIFICATIONS_REQUEST',
  resolve => {
    return () => resolve()
  }
)

export const refreshNotificationsStart = createAction(
  'REFRESH_NOTIFICATIONS_IN_PROGRESS',
  resolve => {
    return () => resolve()
  }
)
export const refreshNotificationsSuccess = createAction(
  'REFRESH_NOTIFICATIONS_SUCCESS',
  resolve => {
    return (results: Notification[]) => resolve({ results })
  }
)
export const refreshNotificationsFailure = createAction(
  'REFRESH_NOTIFICATIONS_FAILURE',
  resolve => {
    return () => resolve()
  }
)
export const newNotificationRequest = createAction(
  'NEW_NOTIFICATION_REQUEST',
  resolve => {
    return (notification: Notification) => resolve({ notification })
  }
)
export const notificationEngagement = createAction(
  'NOTIFICATION_ENGAGEMENT',
  resolve => {
    return (engagement: PushNotification) => resolve({ engagement })
  }
)
export const notificationSuccess = createAction(
  'NOTIFICATION_SUCCESS',
  resolve => {
    return (notification: Notification) => resolve({ notification })
  }
)
export const notificationFailure = createAction(
  'NOTIFICATION_FAILURE',
  resolve => {
    return (notification: Notification) => resolve({ notification })
  }
)
export const reviewNotificationThreadInvite = createAction(
  'REVIEW_NOTIFICATION_THREAD_INVITE',
  resolve => {
    return (notification: InviteReceivedNotification) =>
      resolve({ notification })
  }
)

export const insertNoStorageAlert = createAction(
  'INSERT_NO_STORAGE_ALERT',
  resolve => {
    return (type: LocalAlertType) => resolve({ type })
  }
)

export const removeNoStorageAlert = createAction(
  'REMOVE_NO_STORAGE_ALERT',
  resolve => {
    return (type: LocalAlertType) => resolve({ type })
  }
)
