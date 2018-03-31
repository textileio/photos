// @flow
import { NativeModules } from 'react-native'

const { TextileIPFS } = NativeModules

export default {
  exampleMethod () {
    return TextileIPFS.exampleMethod()
  },

  createNodeWithDataDir (dataDir: string, apiHost: string) {
    console.log('REACT => NATIVE: CREATE NODE')
    TextileIPFS.createNodeWithDataDir(dataDir, apiHost)
  },

  startNode (): Promise<boolean> {
    console.log('REACT => NATIVE: START NODE')
    return TextileIPFS.startNode()
  },

  stopNode (): Promise<boolean> {
    return TextileIPFS.stopNode()
  },

  addImageAtPath(path: string, thumbPath: string): Promise<string> {
    console.log('ADDING IMAGE:', path, thumbPath)
    return TextileIPFS.addImageAtPath(path, thumbPath)
      .then(hash => {
        console.log('ADDED IMAGE:', hash)
        return hash
      })
  },

  getPhotos(offset: string, limit: number): Promise<string> {
    return TextileIPFS.getPhotos(offset, limit)
  },

  getPhotoData(path: string): Promise<string> {
    return TextileIPFS.getPhotoData(path)
  },

  EXAMPLE_CONSTANT: TextileIPFS.EXAMPLE_CONSTANT
}
