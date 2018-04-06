//  Created by react-native-create-bridge

import { NativeEventEmitter, NativeModules } from 'react-native'

const { UploadTask } = NativeModules

export default {
  uploadTaskEmitter: new NativeEventEmitter(UploadTask),

  getUploadTasks: async function (): string[] {
    const tasks = await UploadTask.getUploadTasks()
    return tasks
  },

  uploadFile: function (file: string, toUrl: string, method: string, boundary: string) {
    return UploadTask.uploadFile(file, toUrl, method, boundary)
  }
}
