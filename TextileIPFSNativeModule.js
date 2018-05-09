// @flow
import { NativeModules } from 'react-native'
import { Buffer } from 'buffer'

const { TextileIPFS } = NativeModules

type MultipartData = {
  payloadPath: string,
  boundary: string
}

type LocalhostHeader = {
  Authorization: string
}

type HashRequest = {
  uri: string,
  headers: LocalhostHeader
}

export default {
  createNodeWithDataDir: async function (dataDir: string, apiUrl: string): boolean {
    console.log(dataDir)
    const success = await TextileIPFS.createNodeWithDataDir(dataDir, apiUrl)
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

  signIn: async function (username: string, password: string): string {
    const result = await TextileIPFS.signIn(username, password)
    return result
  },

  signUp: async function (username: string, password: string, email: string, referral: string): string {
    const result = await TextileIPFS.signUpWithEmail(username, password, email, referral)
    return result
  },

  isSignedIn: function (): boolean {
    const result = TextileIPFS.isSignedIn()
    return result
  },

  signOut: async function () {
    await TextileIPFS.signOut()
  },

  getUsername: async function (): string {
    const result = await TextileIPFS.getUsername()
    return result
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
    const result = await TextileIPFS.getPhotos(offset || '', limit, thread)
    return result
  },

  getPhotoData: async function (path: string): string {
    const result = await TextileIPFS.getPhotoData(path)
    return result
  },

  registerToken: async function (hash: string, token: string) {
    await TextileIPFS.setHashToken(hash, token)
  },

  getHashRequest: function (hash: string, path: string): HashRequest {
    let token = ''
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < 48; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    this.registerToken(hash, token)
    console.log('http://localhost:39080/ipfs/' + hash + path)
    const encoded = Buffer.from(':' + token).toString('base64')
    return {
      uri: 'http://localhost:39080/ipfs/' + hash + path,
      headers: {
        Authorization: 'Basic ' + encoded
      }
    }
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
  },

  getAccessToken: async function (): string {
    const result = await TextileIPFS.getAccessToken()
    return result
  }
}
