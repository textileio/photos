import { pb, util } from '@textile/react-native-sdk'
import { Notification } from '../Models/Notifications'
import RNPushNotification from 'react-native-push-notification'
import { Alert } from 'react-native'

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

export function toTypedNotification(notificationData: pb.INotification): Notification {
  const { subjectDesc, subject, target, type, date, user, ...baseNotification } = notificationData
  const d = util.timestampToDate(date)
  switch (type) {
    case pb.Notification.Type.INVITE_RECEIVED:
      return {
        ...baseNotification,
        date: d,
        username: user.name,
        avatar: user.avatar,
        type,
        threadName: subjectDesc
      }
    case pb.Notification.Type.ACCOUNT_PEER_JOINED:
      return {
        ...baseNotification,
        date: d,
        username: user.name,
        avatar: user.avatar,
        type
      }
    case pb.Notification.Type.PEER_JOINED:
      return {
        ...baseNotification,
        date: d,
        username: user.name,
        avatar: user.avatar,
        type,
        threadId: subject,
        threadName: subjectDesc
      }
    case pb.Notification.Type.PEER_LEFT:
      return {
        ...baseNotification,
        date: d,
        username: user.name,
        avatar: user.avatar,
        type,
        threadId: subject,
        threadName: subjectDesc
      }
    case pb.Notification.Type.MESSAGE_ADDED:
      return {
        ...baseNotification,
        date: d,
        username: user.name,
        avatar: user.avatar,
        type,
        threadId: subject,
        threadName: subjectDesc,
        target
      }
    case pb.Notification.Type.FILES_ADDED:
      return {
        ...baseNotification,
        date: d,
        username: user.name,
        avatar: user.avatar,
        type,
        threadId: subject,
        threadName: subjectDesc,
        target
      }
    case pb.Notification.Type.COMMENT_ADDED:
      return {
        ...baseNotification,
        date: d,
        username: user.name,
        avatar: user.avatar,
        type,
        threadId: subject,
        threadName: subjectDesc,
        target
      }
    case pb.Notification.Type.LIKE_ADDED:
      return {
        ...baseNotification,
        date: d,
        username: user.name,
        avatar: user.avatar,
        type,
        threadId: subject,
        threadName: subjectDesc,
        target
      }
  }
}

// Returns blockId if photo type
export function getPhotoId(notification: Notification): string | undefined {
  switch (notification.type) {
    case pb.Notification.Type.COMMENT_ADDED:
    case pb.Notification.Type.FILES_ADDED:
    case pb.Notification.Type.LIKE_ADDED:
      return notification.target
    default:
      return
  }
}

export function notificationTypeToString(type: pb.Notification.Type): string {
  switch (type) {
    case pb.Notification.Type.ACCOUNT_PEER_JOINED:
      return 'ACCOUNT_PEER_JOINED'
    case pb.Notification.Type.COMMENT_ADDED:
      return 'COMMENT_ADDED'
    case pb.Notification.Type.FILES_ADDED:
      return 'FILES_ADDED'
    case pb.Notification.Type.INVITE_RECEIVED:
      return 'INVITE_RECEIVED'
    case pb.Notification.Type.LIKE_ADDED:
      return 'LIKE_ADDED'
    case pb.Notification.Type.MESSAGE_ADDED:
      return 'MESSAGE_ADDED'
    case pb.Notification.Type.PEER_JOINED:
      return 'PEER_JOINED'
    case pb.Notification.Type.PEER_LEFT:
      return 'PEER_LEFT'
  }
}

export function toPayload(notification: Notification): INotificationsPayload {
  const typeString = notificationTypeToString(notification.type)
  const actor = notification.username || 'A contact' // TODO: We want username here, need to look it up?
  switch (notification.type) {
    case(pb.Notification.Type.INVITE_RECEIVED): {
      const title = 'New Invite'
      const message =  [actor, notification.body].join(' ')
      const feed = [actor, notification.body, 'to', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(pb.Notification.Type.ACCOUNT_PEER_JOINED): {
      const title = 'New Contact'
      const message = 'You connected to a new account contact'
      const feed = message
      return { title, message, feed, typeString }
    }
    case(pb.Notification.Type.PEER_JOINED): {
      const title = notification.threadName
      const message =  [actor, notification.body].join(' ')
      const feed = [actor, notification.body, 'group', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(pb.Notification.Type.PEER_LEFT): {
      const title = notification.threadName
      const message =  [actor, notification.body].join(' ')
      const feed = [actor, notification.body, 'group', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(pb.Notification.Type.MESSAGE_ADDED): {
      const title = notification.threadName
      const message =  [actor, 'wrote', notification.body].join(' ')
      const feed = message
      return { title, message, feed, typeString }
    }
    case(pb.Notification.Type.FILES_ADDED): {
      const title = notification.threadName
      const body = 'added a photo'
      const message =  [actor, body].join(' ')
      const feed = [actor, body, 'to', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(pb.Notification.Type.COMMENT_ADDED): {
      const title =  notification.threadName
      const message = [actor, notification.body].join(' ')
      const body = 'commented on a photo' // todo: fix "a" vs "your"
      const feed = [actor, body, 'in', notification.threadName].join(' ')
      return { title, message, feed, typeString }
    }
    case(pb.Notification.Type.LIKE_ADDED): {
      const title = notification.threadName
      const body = 'liked a photo' // todo: fix "a" vs "your"
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
