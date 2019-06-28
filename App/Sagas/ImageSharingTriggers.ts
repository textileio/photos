import { call, put, select, fork, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import RNFS from 'react-native-fs'

import {
  SharedImage,
  ProcessingImage
} from '../features/group/add-photo/models'

import { groupActions, groupSelectors } from '../features/group'
import UIActions from '../Redux/UIRedux'
import {
  insertImage,
  shareWalletImage,
  shareToThread
} from './ImageSharingSagas'
import { logNewEvent } from './DeviceLogs'
import { RootState } from '../Redux/Types'

export function* handleSharePhotoRequest(
  action: ActionType<typeof UIActions.sharePhotoRequest>
) {
  const { image, threadId, comment } = action.payload
  if (typeof image === 'string' && threadId) {
    yield call(shareWalletImage, image, threadId, comment)
  } else if ((image as SharedImage).path) {
    yield call(insertImage, image as SharedImage, threadId, comment)
  }
}

export function* retryImageShare(
  action: ActionType<typeof groupActions.addPhoto.retry>
) {
  const { uuid } = action.payload
  yield call(logNewEvent, 'retryImageShare', uuid)
  const selector = (state: RootState) =>
    groupSelectors.addPhotoSelectors.processingImageByUuidFactory(uuid)(
      state.group.addPhoto
    )
  const processingImage: ProcessingImage | undefined = yield select(
    selector,
    uuid
  )
  if (!processingImage) {
    return
  }
  if (processingImage.status === 'adding') {
    yield call(shareToThread, uuid)
  }
}

export function* cancelImageShare(
  action: ActionType<typeof groupActions.addPhoto.cancelRequest>
) {
  const { uuid } = action.payload
  try {
    const selector = (state: RootState) =>
      groupSelectors.addPhotoSelectors.processingImageByUuidFactory(uuid)(
        state.group.addPhoto
      )
    const processingImage: ProcessingImage | undefined = yield select(
      selector,
      uuid
    )
    if (!processingImage) {
      return
    }

    // Delete the shared image if needed
    const exists: boolean = yield call(
      RNFS.exists,
      processingImage.sharedImage.path
    )
    if (exists && processingImage.sharedImage.canDelete) {
      yield call(RNFS.unlink, processingImage.sharedImage.path)
    }

    // What else? Undo local add, remote pin, remove from wallet?
  } catch (error) {
    yield call(logNewEvent, 'cancelImageShare', error.message, true)
  }
  yield put(groupActions.addPhoto.cancelComplete(uuid))
}

export function* handleImageProcessingError(
  action: ActionType<typeof groupActions.addPhoto.error>
) {
  const { underlyingError } = action.payload.error
  const message =
    (underlyingError.message as string) ||
    (underlyingError as string) ||
    'handleImageProcessingError'
  yield call(logNewEvent, 'Image Processing Error', message, true)
}
