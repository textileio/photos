import { NativeModules } from 'react-native'

const { FS } = NativeModules

export async function getFilePath(uri: string): Promise<string> {
  return await FS.getFilePath(uri)
}
