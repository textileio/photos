import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform
} from 'react-native'

const { Events } = NativeModules

export const eventEmitter = Platform.select({
  android: DeviceEventEmitter,
  ios: new NativeEventEmitter(Events)
})
