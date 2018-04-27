//  Created by react-native-create-bridge

import EventEmitter from 'EventEmitter'
import Upload from 'react-native-background-upload'

const uploadEmitter = new EventEmitter()

export default {
  uploadTaskEmitter: uploadEmitter,

  uploadFile: function (file: string, toUrl: string, method: string, boundary: string) {
    Upload.startUpload(
      {
        path: file,
        url: toUrl,
        method: method,
        type: 'multipart',
        field: boundary
      }
    ).then((uploadId) => {
      Upload.addListener('progress', uploadId, (data) => {
        uploadEmitter.emit('UploadTaskProgress', { file: file, progress: data.progress })
      })
      Upload.addListener('error', uploadId, (data) => {
        uploadEmitter.emit('UploadTaskError', { file: file, error: data.error })
      })
      Upload.addListener('completed', uploadId, () => {
        uploadEmitter.emit('UploadTaskComplete', { file: file })
      })
    }).catch((err) => {
      uploadEmitter.emit('UploadTaskError', { file: file, error: err })
    })
  }
}
