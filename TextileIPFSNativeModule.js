// @flow
import { NativeModules } from 'react-native'

const { TextileIPFS } = NativeModules

export default {
  exampleMethod () {
    return TextileIPFS.exampleMethod()
  },

  createNodeWithDataDir(dataDir: string, apiHost: string) {
    TextileIPFS.createNodeWithDataDir(dataDir, apiHost)
  },

  startNode(): Promise<boolean> {
    return TextileIPFS.startNode()
  },

  stopNode(): Promise<boolean> {
    return TextileIPFS.stopNode()
  },

  pinImageAtPath(path: string, thumbPath: string): Promise<string> {
    return TextileIPFS.pinImageAtPath(path, thumbPath)
  },

  getPhotos(offset: string, limit: number): Promise<string> {
    return TextileIPFS.getPhotos(offset, limit)
  },

  getPhotoData(path: string): Promise<string> {
    return TextileIPFS.getPhotoData(path)
  },

  EXAMPLE_CONSTANT: TextileIPFS.EXAMPLE_CONSTANT
}
