import { createAction, ActionType, getType } from 'typesafe-actions'
import {
  NotificationData,
  Notification,
  ReceivedInviteNotification,
  DeviceAddedNotification,
  PhotoAddedNotification,
  CommentAddedNotification,
  LikeAddedNotification,
  PeerJoinedNotification,
  PeerLeftNotification,
  NotificationType
} from '../Models/TextileTypes'
import { PushNotification } from 'react-native-push-notification'
import { RootState } from './Types'

const actions = {
  readAllNotificationsRequest: createAction('CLEAR_ALL_NOTIFICATIONS_REQUEST', (resolve) => {
    return () => resolve()
  }),
  refreshNotificationsRequest: createAction('REFRESH_NOTIFICATIONS_REQUEST', (resolve) => {
    return () => resolve()
  }),
  refreshNotificationsStart: createAction('REFRESH_NOTIFICATIONS_IN_PROGRESS', (resolve) => {
    return () => resolve()
  }),
  refreshNotificationsSuccess: createAction('REFRESH_NOTIFICATIONS_SUCCESS', (resolve) => {
    return (notifications: NotificationData[]) => resolve({notifications})
  }),
  refreshNotificationsFailure: createAction('REFRESH_NOTIFICATIONS_FAILURE', (resolve) => {
    return () => resolve()
  }),
  newNotificationRequest: createAction('NEW_NOTIFICATION_REQUEST', (resolve) => {
    return (notification: Notification) => resolve({notification})
  }),
  notificationEngagement: createAction('NOTIFICATION_ENGAGEMENT', (resolve) => {
    return (engagement: PushNotification) => resolve({ engagement })
  }),
  notificationSuccess: createAction('NOTIFICATION_SUCCESS', (resolve) => {
    return (notification: Notification) => resolve({ notification })
  }),
  notificationFailure: createAction('NOTIFICATION_FAILURE', (resolve) => {
    return (notification: Notification) => resolve({ notification })
  }),
  reviewNotificationThreadInvite: createAction('REVIEW_NOTIFICATION_THREAD_INVITE', (resolve) => {
    return (notification: ReceivedInviteNotification) => resolve({ notification })
  })
}

export type NotificationsAction = ActionType<typeof actions>

export interface NotificationsState {
  readonly notifications: ReadonlyArray<
    ReceivedInviteNotification |
    DeviceAddedNotification |
    PhotoAddedNotification |
    CommentAddedNotification |
    LikeAddedNotification |
    PeerJoinedNotification |
    PeerLeftNotification
  >,
  refreshing: boolean
}

export const initialState: NotificationsState = {
  notifications: [],
  refreshing: false
}

export function reducer (state: NotificationsState = initialState, action: NotificationsAction): NotificationsState {
  switch (action.type) {
    case getType(actions.newNotificationRequest): {
      // Useful so that new notifications you receive while staring at the Feed will just pop in
      const notifications = state.notifications.slice(0, 99)
      notifications.unshift(action.payload.notification)
      return {...state, notifications}
    }
    case getType(actions.refreshNotificationsStart):
      return { ...state, refreshing: true }
    case getType(actions.refreshNotificationsSuccess):
      // Add it to our list for display
      const { notifications } = action.payload
      const mappedNotifications = notifications.map((notificationData) => {
        switch (notificationData.type) {
          case NotificationType.receivedInviteNotification:
            return new ReceivedInviteNotification(notificationData)
          case NotificationType.deviceAddedNotification:
            return new DeviceAddedNotification(notificationData)
          case NotificationType.photoAddedNotification:
           return new PhotoAddedNotification(notificationData)
          case NotificationType.commentAddedNotification:
           return new CommentAddedNotification(notificationData)
          case NotificationType.likeAddedNotification:
            return new LikeAddedNotification(notificationData)
          case NotificationType.peerJoinedNotification:
            return new PeerJoinedNotification(notificationData)
          case NotificationType.peerLeftNotification: {
            return new PeerLeftNotification(notificationData)
          }
        }
      })
      return { ...state, notifications: mappedNotifications, refreshing: false }
    case getType(actions.refreshNotificationsFailure):
      return { ...state, refreshing: false }
    default:
      return state
  }
}

export const NotificationsSelectors = {
  refreshing: (state: RootState): boolean => state.notifications.refreshing
}

export default actions
