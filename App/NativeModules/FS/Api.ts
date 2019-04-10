import { NativeModules } from 'react-native'

const { FS } = NativeModules

export async function getFilePath(uri: string): Promise<string> {
  return FS.getFilePath(uri)
}
