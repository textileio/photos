import { UpdatesState } from './reducer'
import { Notification, LocalAlert } from './models'

export const refreshing = (state: UpdatesState): boolean =>
  state.notifications.refreshing
export const latestAndUnreadFirst = (state: UpdatesState): Notification[] => {
  return [...state.notifications.results].sort(
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

/**
 * Returns 'true' if there are any unread messages or alerts
 * @param state 
 */
export const inboxStatus = (state: UpdatesState): boolean => {
  if (state.alerts.results.length > 0) {
    return true
  } 
  if (state.notifications.results.find((row) => !row.read)) {
    return true
  }
  return false
}

/**
 * 
 * Returns an alert by string id or undefined
 * @param type string identifier of an alert type
 */
export const getAlert = (type: string) => (state: UpdatesState): LocalAlert | undefined => {
  return state.alerts.results.find((alert) => alert.type === type)
}
export const getAlerts = (state: UpdatesState) => {
  return [...state.alerts.results]
}