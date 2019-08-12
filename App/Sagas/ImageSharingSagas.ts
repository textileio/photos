import { call, put, select, fork } from 'redux-saga/effects'
import Textile, { IBlock, IFilesList } from '@textile/react-native-sdk'
import { ActionType } from 'typesafe-actions'
import FS from 'react-native-fs'

import copyPhoto from '../util/copy-photo'
import { SharedImage } from '../features/group/add-photo/models'
import UIActions, { UISelectors, SharingPhoto } from '../Redux/UIRedux'
import TextileEventsActions from '../Redux/TextileEventsRedux'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import { groupActions } from '../features/group'
import NavigationService from '../Services/NavigationService'
import * as CameraRoll from '../Services/CameraRoll'

function* reqeustGalleryImages() {
  const recentPhotos: IFilesList = yield call(Textile.files.list, '', '', 100)
  // Sharing from the wallet picker depends on shared image schema, not camera roll
  // this is a temp fix to limit what's shown there.
  // TODO: Remove this restriction when camera roll sharing is completed
  const nonCameraRollPhotos = recentPhotos.items.filter(photo =>
    Boolean(photo.files[0].links.large)
  )
  yield put(PhotoViewingActions.getRecentPhotosSuccess(nonCameraRollPhotos))
}

export function* refreshGalleryImages(
  action: ActionType<typeof UIActions.refreshGalleryImages>
) {
  // no need to wait
  yield fork(reqeustGalleryImages)
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

      if (threadId) {
        // only set if shared directly to a thread
        yield put(UIActions.updateSharingPhotoThread(threadId))
      }

      yield put(UIActions.updateSharingPhotoImage(image))
      // yield call(NavigationService.navigate, 'ViewThread')
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

export function* initShareRequest(
  action: ActionType<typeof UIActions.initShareRequest>
) {
  const { threadId, comment } = action.payload
  const sharingPhoto: SharingPhoto = yield select(UISelectors.sharingPhoto)
  if (
    !sharingPhoto ||
    !sharingPhoto.threadId ||
    sharingPhoto.threadId !== threadId
  ) {
    return
  }
  if (sharingPhoto.image) {
    yield put(
      groupActions.addPhoto.sharePhotoRequest(
        sharingPhoto.image,
        threadId,
        comment
      )
    )
    // Group doesn't clean up the UI after like the files method below, so do it now.
    yield put(UIActions.cleanupComplete())
  }
  if (sharingPhoto.files) {
    yield put(
      UIActions.sharePhotoRequest(sharingPhoto.files.data, threadId, comment)
    )
  }
}

export function* handleSharePhotoRequest(
  action: ActionType<typeof UIActions.sharePhotoRequest>
) {
  const { image, threadId, comment } = action.payload
  yield call(shareWalletImage, image, threadId, comment)
}

export function* handleCancel(
  action: ActionType<typeof UIActions.cancelSharingPhoto>
) {
  try {
    const sharingPhoto: SharingPhoto | undefined = yield select(
      UISelectors.sharingPhoto
    )
    if (sharingPhoto && sharingPhoto.image) {
      const exists: boolean = yield call(FS.exists, sharingPhoto.image.path)
      if (exists) {
        yield call(FS.unlink, sharingPhoto.image.path)
      }
    }
  } catch (error) {}
  yield put(UIActions.cleanupComplete())
}
