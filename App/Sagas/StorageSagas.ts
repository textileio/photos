import {call, put, select, take} from 'redux-saga/effects'
import { requestLocalPhotos } from '../NativeModules/CameraRoll'
import { ILocalPhotoResult, SharedImage } from '../Models/TextileTypes'
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
  // TODO: Create and wire up redux flow for photo backup
  // yield put(UIActions.sharePhotoRequest(sharedImage))
  yield call(logNewEvent, 'newLocalPhoto', photo.path)
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
        yield call(requestLocalPhotos, lastRefresh)
          // scan for images
        yield put(StorageActions.setLocalPhotoRefreshEpoch(currentRefresh))
      }
      yield call(logNewEvent, 'refreshLocalImages', 'success')
    } catch (error) {
      yield call(logNewEvent, 'refreshLocalImages', error.message, true)
    }
  }
}
