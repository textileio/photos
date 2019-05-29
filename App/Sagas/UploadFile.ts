import { call, select, put, take } from 'redux-saga/effects'
import Upload from 'react-native-background-upload'
import Config from 'react-native-config'
import { getType } from 'typesafe-actions'
import Textile, { ICafeSession } from '@textile/react-native-sdk'

import { accountSelectors, accountActions } from '../features/account'
import { RootState } from '../Redux/Types'

function* getSession(depth: number = 0): any {
  const session: ICafeSession | undefined = yield select((state: RootState) =>
    accountSelectors.bestSession(state.account)
  )
  if (!session) {
    return undefined
  }
  const expDate = Textile.util.timestampToDate(session.exp)
  if (expDate < new Date()) {
    if (depth === 0) {
      yield put(accountActions.refreshCafeSessionsRequest())
      yield take(getType(accountActions.cafeSessionsSuccess))
      yield call(getSession, 1)
    } else {
      throw new Error('unable to get CafeSession')
    }
  } else {
    return session
  }
}

export function* uploadFile(id: string, payloadPath: string) {
  const session: ICafeSession | undefined = yield call(getSession)
  if (!session || !session.cafe) {
    return
  }
  yield call(Upload.startUpload, {
    customUploadId: id,
    path: payloadPath,
    url: `${session.cafe.url}${Config.RN_TEXTILE_CAFE_API_PIN_PATH}`,
    method: 'POST',
    type: 'raw',
    headers: {
      Authorization: `Bearer ${session.access}`,
      'Content-Type': 'application/octet-stream'
    }
  })
}
