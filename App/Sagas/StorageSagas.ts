import {call, put, select, take} from 'redux-saga/effects'
import TextileNode from '../Services/TextileNode'
import {BlockId, Thread, ILocalPhotoResult, SharedImage} from '../Models/TextileTypes'
import StorageActions, { StorageSelectors } from '../Redux/StorageRedux'
import {ActionType, getType} from 'typesafe-actions'
import PreferencesActions, {PreferencesSelectors} from '../Redux/PreferencesRedux'
import UIActions from '../Redux/UIRedux'
import { defaultThreadData } from '../Redux/PhotoViewingSelectors'
import { ThreadData } from '../Redux/PhotoViewingRedux'
import { logNewEvent } from './DeviceLogs'

export function * newLocalPhoto (action: ActionType<typeof StorageActions.newLocalPhoto>) {
  const { photo } = action.payload
  const sharedImage: SharedImage = {
    uri: photo.uri,
    path: photo.path,
    canDelete: photo.canDelete // <- allow the native layer to dictate if it's a duplicate or not
  }
  yield put(UIActions.sharePhotoRequest(sharedImage))
  yield call(logNewEvent, 'newLocalPhoto', photo.path)
}

// TODO: Not used for now. Revisit if needed
export function * savePhotoToWallet (photo: ILocalPhotoResult) {
  try {
    const addResult = yield call(TextileNode.addPhoto, photo.path)
    const defaultThread: ThreadData | undefined = yield select(defaultThreadData)
    if (!defaultThread) {
      throw new Error('no default thread')
    }
    const blockId: BlockId = yield call(TextileNode.addPhotoToThread, addResult.id, addResult.key, defaultThread.id)
    // Issue: if the user doesn't want to store private files on remote IPFS, we need to record that these are
    // only available locally in case the user then shares
    // Idea perhaps...
    // Store a table of images in StorageRedux
    // path string, hash string, remote string
    // you could set that in this sage with blockId and photo.path above
    // whenever a user shares a photo to a thread from the wallet, just grab the remote?
    // if not remote, do a photo remote pin
    // it will take a slightly modified photo remote pin, since at the end of it all you will skip adding to the wallet
    // maybe?
  } catch (error) {
    // ignore for now. todo
  }
}

export function * toggleStorage (action: ActionType<typeof PreferencesActions.toggleStorageRequest>) {
  const {name} = action.payload
  const storageOption = yield select(PreferencesSelectors.storage, name)
  const storageStatus = !storageOption ? false : storageOption.status
  if (name === 'autoPinPhotos' && storageStatus === true) {
    // Always start autoPinning only from the date of the latest toggle-on
    const now = (new Date()).getTime()
    yield put(StorageActions.setLocalPhotoRefreshEpoch(now))
  }
}

export function * refreshLocalImages () {
  while (yield take(getType(StorageActions.refreshLocalImagesRequest))) {
    try {
      const autoPinEnabled = yield select(PreferencesSelectors.autoPinStatus)
      if (autoPinEnabled) {
        // get time last checked
        const lastRefresh = yield select(StorageSelectors.lastPhotoRefresh)
        // update last time checked to now
        const currentRefresh = (new Date()).getTime()
        yield call(TextileNode.requestLocalPhotos, lastRefresh)
          // scan for images
        yield put(StorageActions.setLocalPhotoRefreshEpoch(currentRefresh))
      }
      yield call(logNewEvent, 'refreshLocalImages', 'success')
    } catch (error) {
      yield call(logNewEvent, 'refreshLocalImages', error.message, true)
    }
  }
}
