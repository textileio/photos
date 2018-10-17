import { Notification, NotificationType, NotificationData } from '../Models/TextileTypes'
import RNPushNotification, { PushNotification } from 'react-native-push-notification'
import { Alert, Platform } from 'react-native'

export interface INotificationsPayload {
  title: string,
  message: string,
  feed: string
  typeString: string,
}

export function toTypedNotification(notificationData: NotificationData): Notification {
  const { subject_id, subject, data_id, type, ...baseNotification } = notificationData
  switch (type) {
    case NotificationType.commentAddedNotification:
      return {
        ...baseNotification,
        type,
        threadId: notificationData.subject_id as any,
        threadName: notificationData.subject as any,
        photoId: notificationData.data_id as any
      }
    case NotificationType.deviceAddedNotification:
      return {
        ...baseNotification,
        type
      }
    case NotificationType.likeAddedNotification:
      return {
        ...baseNotification,
        type,
        threadId: notificationData.subject_id as any,
        threadName: notificationData.subject as any,
        photoId: notificationData.data_id as any
      }
    case NotificationType.peerJoinedNotification:
      return {
        ...baseNotification,
        type,
        threadId: notificationData.subject_id as any,
        threadName: notificationData.subject as any
      }
    case NotificationType.peerLeftNotification:
      return {
        ...baseNotification,
        type,
        threadId: notificationData.subject_id as any,
        threadName: notificationData.subject as any
      }
    case NotificationType.photoAddedNotification:
      return {
        ...baseNotification,
        type,
        threadId: notificationData.subject_id as any,
        threadName: notificationData.subject as any,
        photoId: notificationData.data_id as any
      }
    case NotificationType.receivedInviteNotification:
      return {
        ...baseNotification,
        type,
        threadName: notificationData.subject as any
      }
  }
}

export function isPhoto(notification: Notification): boolean {
  return 'photoId' in notification
}

export function toPayload(notification: Notification): INotificationsPayload | undefined {
  const typeString = NotificationType[notification.type] as string
  const actor = notification.actor_username || 'A peer'

  switch (notification.type) {
    case(NotificationType.receivedInviteNotification): {
      const title = 'New Invite'
      const message =  [actor, notification.body].join(' ')
      const feed = [actor, notification.body, 'to', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(NotificationType.deviceAddedNotification): {
      const title = 'New Device'
      const message = 'You paired with a new device'
      const feed = message
      return { title, message, feed, typeString }
    }
    case(NotificationType.photoAddedNotification): {
      const title = notification.threadName
      const message =  [actor, notification.body].join(' ')
      const feed = [actor, notification.body, 'to', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(NotificationType.commentAddedNotification): {
      const title =  notification.threadName
      const message = [actor, notification.body].join(' ')
      const body = notification.body.split(': ')
      const feed = [actor, body[0], 'in', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(NotificationType.likeAddedNotification): {
      const title = notification.threadName
      const message = [actor, notification.body].join(' ')
      const feed = [actor, notification.body, 'in', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(NotificationType.peerJoinedNotification): {
      const title = notification.threadName
      const message =  [actor, notification.body].join(' ')
      const feed = [actor, notification.body, 'thread', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(NotificationType.peerLeftNotification): {
      const title = notification.threadName
      const message =  [actor, notification.body].join(' ')
      const feed = [actor, notification.body, 'thread', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    default: {
      return undefined
    }
  }
}

export function getData(engagement: PushNotification): any {
  if (Platform.OS !== 'ios') {
    const { data } = engagement
    return data
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
