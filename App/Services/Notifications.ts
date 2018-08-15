import NotificationsIOS from 'react-native-notifications'

export async function sendNotification(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      let now = new Date();
      console.log(now)
      now.setTime(now.getTime() + 1000 * 1.5)
      console.log(now)
      NotificationsIOS.localNotification({
        fireDate: now,
        alertBody: "Kanye just liked your photo!",
        alertTitle: "Textile Photos",
        silent: true,
        category: "Liked Photo",
        userInfo: {}
      })
      console.log('success')
      resolve()
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}
