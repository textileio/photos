// @flow
import { NativeModules } from 'react-native'

const { TextileIPFS } = NativeModules

type MultipartData = {
  payloadPath: string,
  boundary: string
}

export default {
  createNodeWithDataDir: async function (dataDir: string): boolean {
    try {
      const success = await TextileIPFS.createNodeWithDataDir(dataDir)
      return success
    } catch (e) {
      console.log(e)
    }
  },

  startGateway: async function (): boolean {
    try {
      const success = await TextileIPFS.startGateway()
      return success
    } catch (e) {
      console.log(e)
    }
  },

  startNode: async function (): boolean {
    try {
      const success = await TextileIPFS.startNode()
      return success
    } catch (e) {
      console.log(e)
    }
  },

  stopNode: async function (): boolean {
    try {
      const success = await TextileIPFS.stopNode()
      return success
    } catch (e) {
      console.log(e)
    }
  },

  addImageAtPath: async function (path: string, thumbPath: string, thread: string): MultipartData {
    try {
      const multipartData = await TextileIPFS.addImageAtPath(path, thumbPath, thread)
      return multipartData
    } catch (e) {
      console.log(e)
    }
  },

  getPhotos: async function (offset: ?string, limit: number, thread: string): string {
    try {
      const result = await TextileIPFS.getPhotos(offset, limit, thread)
      return result
    } catch (e) {
      console.log(e)
    }
  },

  getPhotoData: async function (path: string): string {
    try {
      const result = await TextileIPFS.getPhotoData(path)
      return result
    } catch (e) {
      console.log(e)
    }
  },

  syncGetPhotoData: function (path: string): string {
    return TextileIPFS.syncGetPhotoData(path)
  },

  pairNewDevice: async function (pubKey: string): string {
    try {
      const result = await TextileIPFS.pairNewDevice(pubKey)
      return result
    } catch (e) {
      console.log(e)
    }
  },

  getFilePath: async function (uri: string): string {
    try {
      const result = await TextileIPFS.getRealPathFromURI(uri)
      return result
    } catch (e) {
      console.log(e)
    }
  }
}
