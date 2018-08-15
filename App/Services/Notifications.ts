import RNLocalNotifications from 'react-native-local-notifications'

export async function sendNotification(id: number, text: string, datetime: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      RNLocalNotifications.createNotification(id, text, datetime, 'default')
      resolve()
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}
