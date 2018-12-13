import { call, put, select, fork, take, race } from 'redux-saga/effects'
import RNFS from 'react-native-fs'
import uuid from 'uuid/v4'
import { uploadFile } from './UploadFile'
import {
  prepareFiles,
  addThreadFiles,
  addThreadFilesByTarget,
  profile,
  setAvatar,
  BlockInfo,
  Profile
} from '../NativeModules/Textile'
import { SharedImage } from '../Models/TextileTypes'
import ProcessingImagesActions, { ProcessingImage } from '../Redux/ProcessingImagesRedux'
import { processingImageByUuid, allUploadsComplete } from '../Redux/ProcessingImagesSelectors'
import UIActions, { UISelectors } from '../Redux/UIRedux'
import AccountActions from '../Redux/AccountRedux'
import TextileNodeActions, { TextileNodeSelectors } from '../Redux/TextileNodeRedux'
import { ActionType, getType } from 'typesafe-actions'
import NavigationService from '../Services/NavigationService'
import * as CameraRoll from '../Services/CameraRoll'
import { IMobilePreparedFiles } from '../NativeModules/Textile/pb/textile-go'
import { waitFor } from './WaitFor'
import { RootAction } from '../Redux/Types'

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
        yield call(NavigationService.navigate, 'ThreadSharePhoto', { backTo: 'SharedPhotos' })
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
    yield call(NavigationService.navigate, 'ThreadSharePhoto', { backTo: 'SharedPhotos' })
  }
}

export function * shareWalletImage (id: string, threadId: string, comment?: string) {
  try {
    // TODO: Insert some state into the processing photos redux in case this takes long or fails
    const blockId: string = yield call(addThreadFilesByTarget, id, threadId, comment)
  } catch (error) {
    yield put(UIActions.imageSharingError(error))
  }
}

export function * insertImage (image: SharedImage, threadId: string, comment?: string) {
  const id = uuid()
  yield put(ProcessingImagesActions.insertImage(id, image, threadId, comment))
  yield call(prepareImage, id)
}

export function * prepareImage (uuid: string) {
  try {
    const processingImage: ProcessingImage | undefined = yield select(processingImageByUuid, uuid)
    if (!processingImage) {
      throw new Error('no ProcessingImage found')
    }
    const { sharedImage, destinationThreadId } = processingImage
    const preparedFiles: IMobilePreparedFiles = yield call(prepare, sharedImage, destinationThreadId)
    if (sharedImage.isAvatar && preparedFiles.dir && preparedFiles.dir.files && preparedFiles.dir.files['large'].hash) {
      // TODO: This doesn't seem right in here, but ok
      const hash = preparedFiles.dir.files['large'].hash as string
      yield fork(updateAvatarAndProfile, hash)
    }
    yield put(ProcessingImagesActions.imagePrepared(uuid, preparedFiles))
    yield call(uploadPins, uuid)
  } catch (error) {
    yield put(ProcessingImagesActions.error({ uuid, underlyingError: error, type: 'general' }))
  }
}

export function * uploadPins (uuid: string) {
  try {
    const processingImage: ProcessingImage | undefined = yield select(processingImageByUuid, uuid)
    if (!processingImage || ! processingImage.uploadData) {
      throw new Error('no ProcessingImage or uploadData found')
    }
    yield fork(monitorForUploadsComplete, uuid)
    for (const uploadId in processingImage.uploadData) {
      if (processingImage.uploadData[uploadId] && (processingImage.uploadData[uploadId].status === 'pending' || processingImage.uploadData[uploadId].status === 'error')) {
        yield put(ProcessingImagesActions.uploadStarted(uuid, uploadId))
        yield call(uploadFile, uploadId, processingImage.uploadData[uploadId].path)
      }
    }
  } catch (error) {
    put(ProcessingImagesActions.error({ uuid, underlyingError: error, type: 'general' }))
  }
}

export function * monitorForUploadsComplete(uuid: string) {
  const { complete } = yield race({
    complete: waitFor(select(allUploadsComplete, uuid)),
    // If there is any error related to this image, we want to cancel the uploads complete listener because the image uploads can
    // be retried and we'll created a new listener for that
    errorAction: take((action: RootAction) => action.type === getType(ProcessingImagesActions.error) && (action.payload.error.uuid === uuid))
  })
  if (complete) {
    yield call(shareToThread, uuid)
  }
}

export function * shareToThread (uuid: string) {
  try {
    const processingImage: ProcessingImage | undefined = yield select(processingImageByUuid, uuid)
    if (!processingImage || !processingImage.preparedFiles || !processingImage.preparedFiles.dir) {
      throw new Error('no ProcessingImage or preparedData or dir found')
    }
    const { dir } = processingImage.preparedFiles
    const blockInfo: BlockInfo = yield call(addThreadFiles, dir, processingImage.destinationThreadId, processingImage.comment)
    yield put(ProcessingImagesActions.sharedToThread(uuid, blockInfo))
    yield put(ProcessingImagesActions.complete(uuid))
  } catch (error) {
    yield put(ProcessingImagesActions.error({ uuid, underlyingError: error, type: 'general' }))
  }
}

async function prepare (image: SharedImage, destinationThreadId: string): Promise<IMobilePreparedFiles> {
  const addResult = await prepareFiles(image.path, destinationThreadId)
  try {
    const exists = await RNFS.exists(image.path)
    if (exists && image.canDelete) {
      await RNFS.unlink(image.path)
    }
  } catch (e) {
  }
  return addResult
}

function * updateAvatarAndProfile (hash: string) {
  try {
    const online: boolean = yield select(TextileNodeSelectors.online)
    if (!online) {
      yield take(getType(TextileNodeActions.nodeOnline))
    }
    yield call(setAvatar, hash)
    const profileResult: Profile = yield call(profile)
    yield put(AccountActions.refreshProfileSuccess(profileResult))
  } catch (error) {
    yield put(AccountActions.profileError(error))
  }
}
