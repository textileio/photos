import { call, put, select } from 'redux-saga/effects'
import Textile, { IBlock } from '@textile/react-native-sdk'
import { ActionType } from 'typesafe-actions'

import copyPhoto from '../util/copy-photo'
import { SharedImage } from '../features/group/add-photo/models'
import UIActions, { UISelectors } from '../Redux/UIRedux'
import TextileEventsActions from '../Redux/TextileEventsRedux'
import NavigationService from '../Services/NavigationService'
import * as CameraRoll from '../Services/CameraRoll'

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
      const updatedImage: CameraRoll.IPickerImage | undefined = yield call(
        copyPhoto,
        pickerResponse
      )
      if (!updatedImage) {
        throw new Error('unable to copy image')
      }
      const image: SharedImage = {
        origURL: updatedImage.origURL,
        uri: updatedImage.uri,
        path: updatedImage.path
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
  yield put(UIActions.updateSharingPhotoFiles(action.payload.photo))
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
