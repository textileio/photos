// @flow
import { NativeModules } from 'react-native'

const { TextileIPFS } = NativeModules

export default {
  createNodeWithDataDir: function (dataDir: string, apiHost: string) {
    TextileIPFS.createNodeWithDataDir(dataDir, apiHost)
  },

  startNode: async function (): boolean {
    const success = await TextileIPFS.startNode()
    return success
  },

  stopNode: async function (): boolean {
    const success = await TextileIPFS.stopNode()
    return success
  },

  addImageAtPath: async function (path: string, thumbPath: string): string {
    console.log('ADDING IMAGE:', path, thumbPath)
    const hash = await TextileIPFS.addImageAtPath(path, thumbPath)
    console.log('ADDED IMAGE:', hash)
    return hash
  },

  getPhotos: async function (offset: string, limit: number): string {
    const result = await TextileIPFS.getPhotos(offset, limit)
    return result
  },

  getPhotoData: async function (path: string): string {
    const result = await TextileIPFS.getPhotoData(path)
    return result
  },

  EXAMPLE_CONSTANT: TextileIPFS.EXAMPLE_CONSTANT
}
