// @flow
import { NativeModules } from 'react-native'
import ImageResizer from 'react-native-image-resizer';

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

  addImageAtPath(path: string): Promise<string> {
    console.log("RESIZING IMAGE", path)
    return ImageResizer.createResizedImage(path, 400, 400, "JPEG", 80)
      .then(response => {
        console.log("RESIZED URI", response.path)
        console.log("INNER PINNING IMAGE:", path, response.path)
        return TextileIPFS.addImageAtPath(path, response.path)
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
