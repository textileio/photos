import { NotificationInfo as NotificationData, NotificationType } from '../NativeModules/Textile'
import { Notification } from '../Models/Notifications'
import RNPushNotification, { PushNotification } from 'react-native-push-notification'
import { Alert, Platform } from 'react-native'

export interface INotificationsPayload {
  title: string,
  message: string,
  feed: string
  typeString: string,
}

export async function enable(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      RNPushNotification.requestPermissions()
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export function toTypedNotification(notificationData: NotificationData): Notification {
  const { subject_id, subject, target, type, ...baseNotification } = notificationData
  switch (type) {
    case NotificationType.InviteReceivedNotification:
      return {
        ...baseNotification,
        type,
        threadName: notificationData.subject
      }
    case NotificationType.AccountPeerJoinedNotification:
      return {
        ...baseNotification,
        type
      }
      case NotificationType.PeerJoinedNotification:
      return {
        ...baseNotification,
        type,
        threadId: notificationData.subject_id,
        threadName: notificationData.subject
      }
    case NotificationType.PeerLeftNotification:
      return {
        ...baseNotification,
        type,
        threadId: notificationData.subject_id,
        threadName: notificationData.subject
      }
      case NotificationType.MessageAddedNotification:
      return {
        ...baseNotification,
        type,
        threadId: notificationData.subject_id,
        threadName: notificationData.subject,
        target: notificationData.target!
      }
      case NotificationType.FilesAddedNotification:
      return {
        ...baseNotification,
        type,
        threadId: notificationData.subject_id,
        threadName: notificationData.subject,
        target: notificationData.target!
      }
    case NotificationType.CommentAddedNotification:
      return {
        ...baseNotification,
        type,
        threadId: notificationData.subject_id,
        threadName: notificationData.subject,
        target: notificationData.target!
      }
    case NotificationType.LikeAddedNotification:
      return {
        ...baseNotification,
        type,
        threadId: notificationData.subject_id,
        threadName: notificationData.subject,
        target: notificationData.target!
      }
  }
}

// Returns blockId if photo type
export function getPhotoId(notification: Notification): string | undefined {
  switch (notification.type) {
    case NotificationType.CommentAddedNotification:
    case NotificationType.FilesAddedNotification:
    case NotificationType.LikeAddedNotification:
      return notification.target
    default:
      return
  }
}

export function toPayload(notification: Notification): INotificationsPayload {
  const typeString = notification.type as string
  const actor = notification.username || 'A contact' // TODO: We want username here, need to look it up?

  switch (notification.type) {
    case(NotificationType.InviteReceivedNotification): {
      const title = 'New Invite'
      const message =  [actor, notification.body].join(' ')
      const feed = [actor, notification.body, 'to', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(NotificationType.AccountPeerJoinedNotification): {
      const title = 'New Contact'
      const message = 'You connected to a new account contact'
      const feed = message
      return { title, message, feed, typeString }
    }
    case(NotificationType.PeerJoinedNotification): {
      const title = notification.threadName
      const message =  [actor, notification.body].join(' ')
      const feed = [actor, notification.body, 'group', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(NotificationType.PeerLeftNotification): {
      const title = notification.threadName
      const message =  [actor, notification.body].join(' ')
      const feed = [actor, notification.body, 'group', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(NotificationType.MessageAddedNotification): {
      const title = notification.threadName
      const message =  [actor, 'wrote', notification.body].join(' ')
      const feed = message
      return { title, message, feed, typeString }
    }
    case(NotificationType.FilesAddedNotification): {
      const title = notification.threadName
      const body = 'added a photo'
      const message =  [actor, body].join(' ')
      const feed = [actor, body, 'to', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(NotificationType.CommentAddedNotification): {
      const title =  notification.threadName
      const message = [actor, notification.body].join(' ')
      const body = 'commented on your photo'
      const feed = [actor, body, 'in', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(NotificationType.LikeAddedNotification): {
      const title = notification.threadName
      const body = 'liked your photo'
      const message = [actor, body].join(' ')
      const feed = [actor, body, 'in', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
  }
}

export async function createNew(notification: Notification): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      const payload = toPayload(notification)
      if (!payload) {
        return
      }
      RNPushNotification.localNotification({
        title: payload.title,
        message: `${payload.message}.`,
        /* Android Only Property */
        group: payload.typeString, // (optional) add group to message
        /* iOS Only Property */
        category: payload.typeString, // (optional) default: null
        userInfo: { notification },

        /* Android Only Properties */
        largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
        smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
        // id: '22', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
        // actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
        // ticker: "My Notification Ticker", // (optional)
        // bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
        // subText: "This is a subText", // (optional) default: none

        /* iOS only properties */
        // alertAction: 'view' // (optional) default: view
        playSound: false,
        vibrate: false
      })
      resolve()
    } catch (error) {
      reject()
    }
  })
}

export function displayInvitePromise(message: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    Alert.alert(
      'Accept Invite',
      message,
      [
        {
          text: 'Accept',
          onPress: resolve
        },
        {
          text: 'Ignore',
          style: 'cancel',
          onPress: reject
        }
      ],
      { cancelable: false }
    )
  })
}

export async function displayInviteAlert(message: string) {
  await displayInvitePromise(message)
  return true
}
