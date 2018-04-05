//  Created by react-native-create-bridge

import { NativeModules } from 'react-native'

const { UploadTask } = NativeModules

export default {
  exampleMethod () {
    return UploadTask.exampleMethod()
  },

  EXAMPLE_CONSTANT: UploadTask.EXAMPLE_CONSTANT
}
