import { NativeModules } from 'react-native'

const { MessageComposer } = NativeModules

export function composeMessage(number: string, message: string) {
  MessageComposer.composeMessage(number, message)
}
