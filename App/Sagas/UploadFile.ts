import { call, put, select } from 'redux-saga/effects'
// @ts-ignore
import Upload from 'react-native-background-upload'
import Config from 'react-native-config'

import TextileNode from '../Services/TextileNode'
import AuthActions, { AuthSelectors } from '../Redux/AuthRedux'
import { CafeTokens } from '../Models/TextileTypes'

export function * uploadFile (id: string, payloadPath: string) {
  let tokens: CafeTokens | undefined = yield select(AuthSelectors.tokens)
  if (!tokens) {
    tokens = yield call(TextileNode.getTokens)
    yield put(AuthActions.getTokensSuccess(tokens!))
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
        'Authorization': `Bearer ${tokens!.access}`,
        'Content-Type': 'application/gzip'
      }
    }
  )
}
