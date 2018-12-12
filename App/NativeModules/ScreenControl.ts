import { NativeModules } from 'react-native'

const { ScreenControl } = NativeModules

export function letScreenSleep() {
  ScreenControl.letScreenSleep()
}

export function keepScreenOn() {
  ScreenControl.keepScreenOn()
}
