import { call, put, select, take } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
// @ts-ignore
import Upload from 'react-native-background-upload'
import Config from 'react-native-config'

import AccountActions from '../Redux/AccountRedux'
import { bestSession } from '../Redux/AccountSelectors'
import { CafeSession } from '../NativeModules/Textile'

export function * uploadFile (id: string, payloadPath: string) {
  const session: CafeSession = yield call(getSession)
  yield call(
    Upload.startUpload,
    {
      customUploadId: id,
      path: payloadPath,
      url: `${Config.RN_TEXTILE_CAFE_API_PREFIX}${session.http_addr}${Config.RN_TEXTILE_CAFE_API_PIN_PATH}`,
      method: 'POST',
      type: 'raw',
      headers: {
        Authorization: `Bearer ${session.access}`
      }
    }
  )
}

function * getSession (depth: number = 0): any {
  const session: CafeSession | undefined = yield select(bestSession)
  if (!session || new Date(session.expiry) < new Date()) {
    if (depth === 0) {
      yield put(AccountActions.refreshCafeSessionsRequest())
      yield take(getType(AccountActions.cafeSessionsSuccess))
      yield call(getSession, 1)
    } else {
      throw new Error('unable to get CafeSession')
    }
  } else {
    return session
  }
}
