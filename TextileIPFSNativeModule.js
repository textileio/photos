// @flow
import { NativeModules } from 'react-native'

const { TextileIPFS } = NativeModules

type MultipartData = {
  payloadPath: string,
  boundary: string
}

export default {
  createNodeWithDataDir: async function (dataDir: string): boolean {
    const success = await TextileIPFS.createNodeWithDataDir(dataDir)
    return success
  },

  startGateway: async function (): boolean {
    const success = await TextileIPFS.startGateway()
    return success
  },

  startNode: async function (): boolean {
    const success = await TextileIPFS.startNode()
    return success
  },

  stopNode: async function (): boolean {
    const success = await TextileIPFS.stopNode()
    return success
  },

  addImageAtPath: async function (path: string, thumbPath: string, thread: string): MultipartData {
    console.log('ADDING IMAGE:', path, thumbPath, thread)
    const multipartData = await TextileIPFS.addImageAtPath(path, thumbPath, thread)
    console.log('ADDED IMAGE:', multipartData)
    return multipartData
  },

  getPhotos: async function (offset: string, limit: number, thread: string): string {
    const result = await TextileIPFS.getPhotos(offset, limit, thread)
    return result
  },

  getPhotoData: async function (path: string): string {
    const result = await TextileIPFS.getPhotoData(path)
    return result
  },

  syncGetPhotoData: function (path: string): string {
    return TextileIPFS.syncGetPhotoData(path)
  },

  pairNewDevice: async function (pubKey: string): string {
    const result = await TextileIPFS.pairNewDevice(pubKey)
    return result
  }
}
