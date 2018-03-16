// @flow
// Created by react-native-create-bridge

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

  pinImageAtPath(path: string): Promise<string> {
    return TextileIPFS.pinImageAtPath(path)
  },

  EXAMPLE_CONSTANT: TextileIPFS.EXAMPLE_CONSTANT
}
