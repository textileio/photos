import { createAction, ActionType, getType } from 'typesafe-actions'
import {
  Notification,
  InviteReceivedNotification
} from '../Models/Notifications'
import { RootState } from './Types'
import { PushNotification } from '../Services/EventHandlers/NotificationEventHandler'

const actions = {
  readAllNotificationsRequest: createAction(
    'CLEAR_ALL_NOTIFICATIONS_REQUEST',
    resolve => {
      return () => resolve()
    }
  ),
  refreshNotificationsRequest: createAction(
    'REFRESH_NOTIFICATIONS_REQUEST',
    resolve => {
      return () => resolve()
    }
  ),
  refreshNotificationsStart: createAction(
    'REFRESH_NOTIFICATIONS_IN_PROGRESS',
    resolve => {
      return () => resolve()
    }
  ),
  refreshNotificationsSuccess: createAction(
    'REFRESH_NOTIFICATIONS_SUCCESS',
    resolve => {
      return (notifications: Notification[]) => resolve({ notifications })
    }
  ),
  refreshNotificationsFailure: createAction(
    'REFRESH_NOTIFICATIONS_FAILURE',
    resolve => {
      return () => resolve()
    }
  ),
  newNotificationRequest: createAction('NEW_NOTIFICATION_REQUEST', resolve => {
    return (notification: Notification) => resolve({ notification })
  }),
  notificationEngagement: createAction('NOTIFICATION_ENGAGEMENT', resolve => {
    return (engagement: PushNotification) => resolve({ engagement })
  }),
  notificationSuccess: createAction('NOTIFICATION_SUCCESS', resolve => {
    return (notification: Notification) => resolve({ notification })
  }),
  notificationFailure: createAction('NOTIFICATION_FAILURE', resolve => {
    return (notification: Notification) => resolve({ notification })
  }),
  reviewNotificationThreadInvite: createAction(
    'REVIEW_NOTIFICATION_THREAD_INVITE',
    resolve => {
      return (notification: InviteReceivedNotification) =>
        resolve({ notification })
    }
  )
}

export type NotificationsAction = ActionType<typeof actions>

export interface NotificationsState {
  readonly notifications: ReadonlyArray<Notification>
  refreshing: boolean
}

export const initialState: NotificationsState = {
  notifications: [],
  refreshing: false
}

export function reducer(
  state: NotificationsState = initialState,
  action: NotificationsAction
): NotificationsState {
  switch (action.type) {
    case getType(actions.newNotificationRequest): {
      // Useful so that new notifications you receive while staring at the Feed will just pop in
      const notifications = state.notifications.slice(0, 99)
      notifications.unshift(action.payload.notification)
      return { ...state, notifications }
    }
    case getType(actions.refreshNotificationsStart):
      return { ...state, refreshing: true }
    case getType(actions.refreshNotificationsSuccess): {
      // Add it to our list for display
      const { notifications } = action.payload
      return { ...state, notifications, refreshing: false }
    }
    case getType(actions.refreshNotificationsFailure):
      return { ...state, refreshing: false }
    default:
      return state
  }
}

export const NotificationsSelectors = {
  refreshing: (state: RootState): boolean => state.notifications.refreshing,
  latestAndUnreadFirst: (state: RootState): Notification[] => {
    return [...state.notifications.notifications].sort(
      (n1: Notification, n2: Notification): number => {
        if (!n1.read && n2.read) {
          // if n1 is only one not read it should be first
          return -1
        } else if (n1.read && !n2.read) {
          // if n2 is only one not read it should be first
          return 1
        } else if (n1.date >= n2.date) {
          // otherwise if both are read or both are unread, sort by date
          return -1
        } else {
          return 1
        }
      }
    )
  }
}

export default actions
