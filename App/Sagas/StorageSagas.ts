import { call, put, select } from 'redux-saga/effects'
import RNFS from 'react-native-fs'
import uuid from 'uuid/v4'

import { uploadFile } from './UploadFile'
import getDefaultThread from './GetDefaultThread'
import TextileNode from '../../TextileNode'
import {AddResult, BlockId, SharedImage, PhotoId, Thread, ThreadId, ILocalPhotoResult} from '../Models/TextileTypes'
import ProcessingImagesActions, { ProcessingImage, ProcessingImagesSelectors } from '../Redux/ProcessingImagesRedux'
import UIActions from '../Redux/UIRedux'
import {ActionType} from "typesafe-actions";
import PreferencesActions, {PreferencesSelectors} from "../Redux/PreferencesRedux";

export function * toggleStorage (action: ActionType<typeof PreferencesActions.toggleStorageRequest>) {
  const {name} = action.payload
  const storageOption = yield select(PreferencesSelectors.storage, name)
  const storageStatus = !storageOption ? false : storageOption.status
  if (name === 'autoPinPhotos' && storageStatus === true) {
    const now = (new Date()).getTime()
    console.log('Setting now', now)
    yield put(ProcessingImagesActions.setLocalPhotoRefreshEpoch(now))
  }
}

export function * requestNewLocalImages () {
  try {
    let autoPinEnabled = yield select(PreferencesSelectors.autoPinStatus)
    console.log('autoPinEnabled', autoPinEnabled)
    if (autoPinEnabled) {
      console.log('updating')
      const currentRefresh = (new Date()).getTime()
      // get time last checked
      const lastRefresh = yield select(ProcessingImagesSelectors.lastPhotoRefresh)
      // update last time checked to now
      yield put(ProcessingImagesActions.setLocalPhotoRefreshEpoch(currentRefresh))
      // scan for images
      yield call(TextileNode.requestLocalPhotos, lastRefresh)
    }
  } catch (error) {
    console.log("msg")
    console.log(error)
  }
}
