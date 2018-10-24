import { call, put, select } from 'redux-saga/effects'
import RNFS from 'react-native-fs'
import uuid from 'uuid/v4'

import { uploadFile } from './UploadFile'
import TextileNode from '../Services/TextileNode'
import {AddResult, BlockId, SharedImage, PhotoId, Thread, ThreadId} from '../Models/TextileTypes'
import ProcessingImagesActions, { ProcessingImage, ProcessingImagesSelectors } from '../Redux/ProcessingImagesRedux'
import UIActions, {UISelectors} from '../Redux/UIRedux'
import { defaultThreadData } from '../Redux/PhotoViewingSelectors'
import { ThreadData } from '../Redux/PhotoViewingRedux'
import {ActionType} from 'typesafe-actions'
import NavigationService from '../Services/NavigationService'
import * as CameraRoll from '../Services/CameraRoll'
import * as TT from '../Models/TextileTypes'

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
      pickerResponse = yield CameraRoll.launchCamera()
      break
    }
    case 'camera-roll': {
      pickerResponse = yield CameraRoll.launchImageLibrary()
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
      const image: TT.SharedImage = {
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
  yield put(UIActions.updateSharingPhotoImage(action.payload.photoId))
  // indicates if request was made from merged main feed or from a specific thread
  const threadId = yield select(UISelectors.sharingPhotoThread)
  if (threadId) {
    yield call(NavigationService.navigate, 'ThreadSharePhoto', { backTo: 'ViewThread' })
  } else {
    yield call(NavigationService.navigate, 'ThreadSharePhoto', { backTo: 'SharedPhotos' })
  }
}

export function * shareWalletImage (id: PhotoId, threadId: ThreadId, comment?: string) {
  try {
    // TODO: Insert some state into the processing photos redux in case this takes long or fails
    const blockId: BlockId = yield call(TextileNode.sharePhotoToThread, id, threadId, comment)
  } catch (error) {
    yield put(UIActions.imageSharingError(error))
  }
}

export function * insertImage (image: SharedImage, threadId?: ThreadId, comment?: string) {
  const id = uuid()
  yield put(ProcessingImagesActions.insertImage(id, image, threadId, comment))
  yield call(addToIpfs, id)
}

export function * addToIpfs (uuid: string) {
  try {
    const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByUuid, uuid)
    if (!processingImage) {
      throw new Error('no ProcessingImage found')
    }
    yield put(ProcessingImagesActions.addingImage(uuid))
    const { sharedImage } = processingImage
    const addResult: AddResult = yield call(addImage, sharedImage)
    yield put(ProcessingImagesActions.imageAdded(uuid, addResult))
    yield call(uploadArchive, uuid)
  } catch (error) {
    yield put(ProcessingImagesActions.error(uuid, error))
  }
}

export function * uploadArchive (uuid: string) {
  try {
    const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByUuid, uuid)
    if (!processingImage) {
      throw new Error('no ProcessingImage found')
    }
    yield put(ProcessingImagesActions.uploadStarted(uuid))
    if (!processingImage.addData || !processingImage.addData.addResult.archive) {
      throw new Error('no addData or archive')
    }
    yield call(uploadFile, uuid, processingImage.addData.addResult.archive.path)
  } catch (error) {
    put(ProcessingImagesActions.error(uuid, error))
  }
}

export function * addToWallet (uuid: string) {
  try {
    const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByUuid, uuid)
    if (!processingImage || !processingImage.addData) {
      throw new Error('no ProcessingImage or addData found')
    }
    const { id, key } = processingImage.addData.addResult
    yield put(ProcessingImagesActions.addingToWallet(uuid))
    const defaultThread: ThreadData | undefined = yield select(defaultThreadData)
    if (!defaultThread) {
      throw new Error('no default thread')
    }
    const blockId: BlockId = yield call(TextileNode.addPhotoToThread, id, key, defaultThread.id)
    yield put(ProcessingImagesActions.addedToWallet(uuid, blockId))
    if (processingImage.destinationThreadId) {
      yield call(shareToThread, uuid)
    } else {
      // If there is no destinationThreadId, just complete after adding to wallet
      yield put(ProcessingImagesActions.complete(uuid))
    }
  } catch (error) {
    yield put(ProcessingImagesActions.error(uuid, error))
  }
}

export function * shareToThread (uuid: string) {
  try {
    const processingImage: ProcessingImage | undefined = yield select(ProcessingImagesSelectors.processingImageByUuid, uuid)
    if (!processingImage || !processingImage.addData) {
      throw new Error('no ProcessingImage or addData found')
    }
    const { id } = processingImage.addData.addResult
    yield put(ProcessingImagesActions.sharingToThread(uuid))
    const { destinationThreadId, comment } = processingImage
    if (destinationThreadId) {
      const shareBlockId: BlockId = yield call(TextileNode.sharePhotoToThread, id, destinationThreadId, comment)
      yield put(ProcessingImagesActions.sharedToThread(uuid, shareBlockId))
      yield put(ProcessingImagesActions.complete(uuid))
    }
  } catch (error) {
    yield put(ProcessingImagesActions.error(uuid, error))
  }
}

async function addImage (image: SharedImage): Promise<AddResult> {
  const addResult = await TextileNode.addPhoto(image.path)
  try {
    const exists = await RNFS.exists(image.path)
    if (exists && image.canDelete) {
      await RNFS.unlink(image.path)
    }
  } catch (e) {
  }
  return addResult
}
