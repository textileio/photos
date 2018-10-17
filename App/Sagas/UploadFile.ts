import { call, put, select } from 'redux-saga/effects'
// @ts-ignore
import Upload from 'react-native-background-upload'
// @ts-ignore
import Config from 'react-native-config'

import TextileNode from '../../TextileNode'
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
      url: Config.TEXTILE_CAFE_URI + Config.TEXTILE_CAFE_PIN_PATH,
      method: 'POST',
      type: 'raw',
      headers: {
        'Authorization': `Bearer ${tokens!.access}`,
        'Content-Type': 'application/gzip'
      }
    }
  )
}
