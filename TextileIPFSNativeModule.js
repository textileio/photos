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

  startNode: async function (): boolean {
    const success = await TextileIPFS.startNode()
    return success
  },

  stopNode: async function (): boolean {
    const success = await TextileIPFS.stopNode()
    return success
  },

  addImageAtPath: async function (path: string, thumbPath: string, thread: string): MultipartData {
    const multipartData = await TextileIPFS.addImageAtPath(path, thumbPath, thread)
    return multipartData
  },

  sharePhoto: async function (hash: string, thread: string): MultipartData {
    const multipartData = await TextileIPFS.sharePhoto(hash, thread)
    return multipartData
  },

  getPhotos: async function (offset: ?string, limit: number, thread: string): string {
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
  },

  getFilePath: async function (uri: string): string {
    const result = await TextileIPFS.getRealPathFromURI(uri)
    return result
  },

  getGatewayPassword: function (): string {
    return TextileIPFS.getGatewayPassword()
  }
}
