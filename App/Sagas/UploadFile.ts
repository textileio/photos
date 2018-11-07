import { call, put, select } from 'redux-saga/effects'
// @ts-ignore
import Upload from 'react-native-background-upload'
import Config from 'react-native-config'

import AuthActions, { AuthSelectors } from '../Redux/AuthRedux'
import { CafeSessions, cafeSession, cafeSessions } from '../NativeModules/Textile'

export function * uploadFile (id: string, payloadPath: string) {
  let sessions: CafeSessions | undefined = yield select(AuthSelectors.sessions)
  if (!sessions) {
    sessions = yield call(cafeSessions)
    yield put(AuthActions.getSessionsSuccess(sessions!))
  }
  yield call(
    Upload.startUpload,
    {
      customUploadId: id,
      path: payloadPath,
      url: Config.RN_TEXTILE_CAFE_URI + Config.RN_TEXTILE_CAFE_PIN_PATH,
      method: 'POST',
      type: 'raw',
      headers: {

        // TODO: Figure out auth with new API

        // 'Authorization': `Bearer ${sessions!.access}`,
        'Content-Type': 'application/gzip'
      }
    }
  )
}
