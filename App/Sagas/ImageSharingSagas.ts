import { call, put, select, fork, take, race } from 'redux-saga/effects'
import RNFS from 'react-native-fs'
import uuid from 'uuid/v4'
import { uploadFile } from './UploadFile'
import Textile, {
  API,
  pb
} from '@textile/react-native-sdk'
import { SharedImage, ProcessingImage } from '../features/group/add-photo/models'
import AccountActions from '../Redux/AccountRedux'
import { groupActions } from '../features/group'
import { groupSelectors } from '../features/group'
import UIActions, { UISelectors } from '../Redux/UIRedux'
import { ActionType, getType } from 'typesafe-actions'
import NavigationService from '../Services/NavigationService'
import * as CameraRoll from '../Services/CameraRoll'
import { waitFor } from '@textile/redux-saga-wait-for'
import { RootAction, RootState } from '../Redux/Types'

export function * showWalletPicker(action: ActionType<typeof UIActions.showWalletPicker>) {
  const { threadId } = action.payload
  if (threadId) {
    // only set if shared directly to a thread
    yield put(UIActions.updateSharingPhotoThread(threadId))
  }
  yield call(NavigationService.navigate, 'WalletPicker')
}

// Called whenever someone clicks the share button
export function * showImagePicker(action: ActionType<typeof UIActions.showImagePicker>) {
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
    yield put(UIActions.newImagePickerError(error, 'There was an issue with the photo picker. Please try again.'))
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
        yield call(NavigationService.navigate, 'ThreadSharePhoto', { backTo: 'ViewThread' })
      } else {
        yield call(NavigationService.navigate, 'ThreadSharePhoto', { backTo: 'Groups' })
      }
    } catch (error) {
      yield put(UIActions.newImagePickerError(error, 'There was an issue with your photo selection. Please try again.'))
    }
  }
}

// Called whenever someone selects to share from the wallet and then picks a photo
export function * walletPickerSuccess(action: ActionType<typeof UIActions.walletPickerSuccess>) {
  yield put(UIActions.updateSharingPhotoImage(action.payload.photo))
  // indicates if request was made from merged main feed or from a specific thread
  const threadId = yield select(UISelectors.sharingPhotoThread)
  if (threadId) {
    yield call(NavigationService.navigate, 'ThreadSharePhoto', { backTo: 'ViewThread' })
  } else {
    yield call(NavigationService.navigate, 'ThreadSharePhoto', { backTo: 'Groups' })
  }
}

export function * shareWalletImage (id: string, threadId: string, comment?: string) {
  try {
    // TODO: Insert some state into the processing photos redux in case this takes long or fails
    const blockId: string = yield call(API.files.addByTarget, id, threadId, comment)
  } catch (error) {
    yield put(UIActions.imageSharingError(error))
  }
}

export function * insertImage (image: SharedImage, threadId: string, comment?: string) {
  const id = uuid()
  yield put(groupActions.addPhoto.insertImage(id, image, threadId, comment))
  yield call(prepareImage, id)
}

export function * prepareImage (uuid: string) {
  try {
    const selector = (rootState: RootState) => groupSelectors.addPhotoSelectors.processingImageByUuidFactory(uuid)(rootState.group.addPhoto)
    const processingImage: ProcessingImage | undefined = yield select(selector)
    if (!processingImage) {
      throw new Error('no ProcessingImage found')
    }
    const { sharedImage, destinationThreadId } = processingImage
    const preparedFiles: pb.IMobilePreparedFiles = yield call(prepare, sharedImage, destinationThreadId)
    if (sharedImage.isAvatar && preparedFiles.dir) {
      const rawItem = preparedFiles.dir.files['raw']
      if (rawItem) {
        // TODO: This doesn't seem right in here, but ok
        const hash = rawItem.hash
        // TODO: might error if node not online...
        yield put(AccountActions.setAvatarRequest(hash))
        // yield fork(Textile.updateAvatarAndProfile, hash)
      }
    }
    yield put(groupActions.addPhoto.imagePrepared(uuid, preparedFiles))
    yield call(uploadPins, uuid)
  } catch (error) {
    yield put(groupActions.addPhoto.error({ uuid, underlyingError: error, type: 'general' }))
  }
}

export function * uploadPins (uuid: string) {
  try {
    const selector = (rootState: RootState) => groupSelectors.addPhotoSelectors.processingImageByUuidFactory(uuid)(rootState.group.addPhoto)
    const processingImage: ProcessingImage | undefined = yield select(selector)
    if (!processingImage || ! processingImage.uploadData) {
      throw new Error('no ProcessingImage or uploadData found')
    }
    yield fork(monitorForUploadsComplete, uuid)
    for (const uploadId in processingImage.uploadData) {
      if (processingImage.uploadData[uploadId] && (processingImage.uploadData[uploadId].status === 'pending' || processingImage.uploadData[uploadId].status === 'error')) {
        yield put(groupActions.addPhoto.uploadStarted(uuid, uploadId))
        yield call(uploadFile, uploadId, processingImage.uploadData[uploadId].path)
      }
    }
  } catch (error) {
    put(groupActions.addPhoto.error({ uuid, underlyingError: error, type: 'general' }))
  }
}

export function * monitorForUploadsComplete(uuid: string) {
  const selector = (state: RootState) => groupSelectors.addPhotoSelectors.allUploadsComplete(state.group.addPhoto, uuid)
  const { complete } = yield race({
    complete: waitFor(select(selector, uuid)),
    // If there is any error related to this image, we want to cancel the uploads complete listener because the image uploads can
    // be retried and we'll created a new listener for that
    errorAction: take((action: RootAction) => action.type === getType(groupActions.addPhoto.error) && (action.payload.error.uuid === uuid))
  })
  if (complete) {
    yield call(shareToThread, uuid)
  }
}

export function * shareToThread (uuid: string) {
  try {
    const selector = (rootState: RootState) => groupSelectors.addPhotoSelectors.processingImageByUuidFactory(uuid)(rootState.group.addPhoto)
    const processingImage: ProcessingImage | undefined = yield select(selector)
    if (!processingImage || !processingImage.preparedFiles || !processingImage.preparedFiles.dir) {
      throw new Error('no ProcessingImage or preparedData or dir found')
    }
    const { dir } = processingImage.preparedFiles
    const blockInfo: pb.Block = yield call(API.files.add, dir, processingImage.destinationThreadId, processingImage.comment)
    yield put(groupActions.addPhoto.sharedToThread(uuid, blockInfo))
    yield put(groupActions.addPhoto.complete(uuid))
  } catch (error) {
    yield put(groupActions.addPhoto.error({ uuid, underlyingError: error, type: 'general' }))
  }
}

export async function prepare (image: SharedImage, destinationThreadId: string): Promise<pb.IMobilePreparedFiles> {
  const addResult = await API.files.prepareAsync(image.path, destinationThreadId)
  try {
    const exists = await RNFS.exists(image.path)
    if (exists && image.canDelete) {
      await RNFS.unlink(image.path)
    }
  } catch (e) {
  }
  return addResult
}
