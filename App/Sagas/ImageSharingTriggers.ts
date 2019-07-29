import { call, put, select } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'

import UIActions from '../Redux/UIRedux'
import { shareWalletImage } from './ImageSharingSagas'

export function* handleSharePhotoRequest(
  action: ActionType<typeof UIActions.sharePhotoRequest>
) {
  const { image, threadId, comment } = action.payload
  yield call(shareWalletImage, image, threadId, comment)
}
