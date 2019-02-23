import { call } from 'redux-saga/effects'
import Upload from 'react-native-background-upload'
import Config from 'react-native-config'

import { getSession } from './Account/AccountSagas'
import { pb } from '@textile/react-native-sdk'

export function * uploadFile (id: string, payloadPath: string) {
  const session: pb.ICafeSession | undefined = yield call(getSession)
  if (!session || !session.cafe) {
    return
  }
  yield call(
    Upload.startUpload,
    {
      customUploadId: id,
      path: payloadPath,
      url: `${session.cafe.url}${Config.RN_TEXTILE_CAFE_API_PIN_PATH}`,
      method: 'POST',
      type: 'raw',
      headers: {
        'Authorization': `Bearer ${session.access}`,
        'Content-Type': 'application/octet-stream'
      }
    }
  )
}
