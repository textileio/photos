import {call, put, select, take} from 'redux-saga/effects'

import getDefaultThread from './GetDefaultThread'
import TextileNode from '../../TextileNode'
import {BlockId, Thread, ILocalPhotoResult} from '../Models/TextileTypes'
import StorageActions, { StorageSelectors } from '../Redux/StorageRedux'
import {ActionType, getType} from 'typesafe-actions'
import PreferencesActions, {PreferencesSelectors} from '../Redux/PreferencesRedux'

export function * newLocalPhoto (action: ActionType<typeof StorageActions.newLocalPhoto>) {
  const { photo } = action.payload
  yield call(savePhotoToWallet, photo)
}

export function * savePhotoToWallet (photo: ILocalPhotoResult) {
  try {
    const addResult = yield call(TextileNode.addPhoto, photo.path)
    const defaultThread: Thread = yield* getDefaultThread()
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
        const currentRefresh = (new Date()).getTime()
        // get time last checked
        const lastRefresh = yield select(StorageSelectors.lastPhotoRefresh)
        // scan for images
        yield call(TextileNode.requestLocalPhotos, lastRefresh)
        // update last time checked to now
        yield put(StorageActions.setLocalPhotoRefreshEpoch(currentRefresh))
      }
    } catch (error) {
      // ignore
    }
  }
}
