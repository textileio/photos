import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  newNotification: createAction('NEW_NOTIFICATION_REQUEST', resolve => {
    return (notification: TextileTypes.Notification) => resolve({notification})
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
    case getType(actions.newNotification):
      const notification = action.payload.notification
      const possible = notification.unique ? state.notifications.filter((n) => {
        return n.category !== notification.category && n.type !== notification.type
      }).slice(0, 99) : state.notifications.slice(0, 99)
      return { ...state, notifications: [notification, ...possible] }
    default:
      return state
  }
}

export const NotificationsSelectors = {
}

export default actions
