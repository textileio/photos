import { call, put, select } from 'redux-saga/effects'
import uuid from 'uuid/v4'
import Textile, { IBlock, IStrings } from '@textile/react-native-sdk'
import {
  SharedImage,
  ProcessingImage
} from '../features/group/add-photo/models'
import { groupActions, groupSelectors } from '../features/group'
import UIActions, { UISelectors } from '../Redux/UIRedux'
import TextileEventsActions from '../Redux/TextileEventsRedux'
import { ActionType, getType } from 'typesafe-actions'
import NavigationService from '../Services/NavigationService'
import * as CameraRoll from '../Services/CameraRoll'
import { RootState } from '../Redux/Types'

export function* shareToThread(uuid: string) {
  try {
    const selector = (rootState: RootState) =>
      groupSelectors.addPhotoSelectors.processingImageByUuidFactory(uuid)(
        rootState.group.addPhoto
      )
    const processingImage: ProcessingImage | undefined = yield select(selector)
    if (!processingImage) {
      throw new Error('no ProcessingImage found')
    }
    const blockInfo: IBlock = yield call(
      Textile.files.addFiles,
      processingImage.sharedImage.path,
      processingImage.destinationThreadId,
      processingImage.comment
    )
    yield put(groupActions.addPhoto.addedToThread(uuid, blockInfo))
    yield put(groupActions.addPhoto.complete(uuid))
  } catch (error) {
    yield put(
      groupActions.addPhoto.error({
        uuid,
        underlyingError: error,
        type: 'general'
      })
    )
  }
}

export function* showWalletPicker(
  action: ActionType<typeof UIActions.showWalletPicker>
) {
  const { threadId } = action.payload
  if (threadId) {
    // only set if shared directly to a thread
    yield put(UIActions.updateSharingPhotoThread(threadId))
  }
  yield call(NavigationService.navigate, 'WalletPicker')
}

// Called whenever someone clicks the share button
export function* showImagePicker(
  action: ActionType<typeof UIActions.showImagePicker>
) {
  const { pickerType } = action.payload
  // Present image picker
  let pickerResponse: CameraRoll.IPickerImage

  switch (pickerType) {
    case 'camera': {
      pickerResponse = yield call(CameraRoll.launchCamera)
      break
    }
    case 'camera-roll': {
      pickerResponse = yield call(CameraRoll.launchImageLibrary)
      break
    }
    default:
      return
  }

  const threadId = yield select(UISelectors.sharingPhotoThread)
  if (pickerResponse.didCancel) {
    // Detect cancel of image picker
  } else if (pickerResponse.error) {
    // pickerResponse.error is a string... i think all the time
    const error = new Error('Image picker error')
    yield put(
      UIActions.newImagePickerError(
        error,
        'There was an issue with the photo picker. Please try again.'
      )
    )
  } else {
    try {
      const image: SharedImage = {
        isAvatar: false,
        origURL: pickerResponse.origURL,
        uri: pickerResponse.uri,
        path: pickerResponse.path,
        canDelete: pickerResponse.canDelete
      }
      yield put(UIActions.updateSharingPhotoImage(image))

      if (threadId) {
        // only set if shared directly to a thread
        yield put(UIActions.updateSharingPhotoThread(threadId))
        yield call(NavigationService.navigate, 'ThreadSharePhoto', {
          backTo: 'ViewThread'
        })
      } else {
        yield call(NavigationService.navigate, 'ThreadSharePhoto', {
          backTo: 'Groups'
        })
      }
    } catch (error) {
      yield put(
        UIActions.newImagePickerError(
          error,
          'There was an issue with your photo selection. Please try again.'
        )
      )
    }
  }
}

// Called whenever someone selects to share from the wallet and then picks a photo
export function* walletPickerSuccess(
  action: ActionType<typeof UIActions.walletPickerSuccess>
) {
  yield put(UIActions.updateSharingPhotoImage(action.payload.photo))
  // indicates if request was made from merged main feed or from a specific thread
  const threadId = yield select(UISelectors.sharingPhotoThread)
  if (threadId) {
    yield call(NavigationService.navigate, 'ThreadSharePhoto', {
      backTo: 'ViewThread'
    })
  } else {
    yield call(NavigationService.navigate, 'ThreadSharePhoto', {
      backTo: 'Groups'
    })
  }
}

export function* shareWalletImage(
  id: string,
  threadId: string,
  comment?: string
) {
  try {
    // TODO: Insert some state into the processing photos redux in case this takes long or fails
    const block: IBlock = yield call(
      Textile.files.shareFiles,
      id,
      threadId,
      comment
    )
  } catch (error) {
    yield put(
      TextileEventsActions.newErrorMessage('shareWalletImage', error.message)
    )
    yield put(UIActions.imageSharingError(error))
  }
}

export function* insertImage(
  image: SharedImage,
  threadId: string,
  comment?: string
) {
  const id = uuid()
  yield put(groupActions.addPhoto.insertImage(id, image, threadId, comment))
  yield call(shareToThread, id)
}
