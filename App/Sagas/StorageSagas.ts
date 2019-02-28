import { put, select } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'

import PreferencesActions, { PreferencesSelectors } from '../Redux/PreferencesRedux'
import { photosActions } from '../features/photos'

export function * toggleStorage(action: ActionType<typeof PreferencesActions.toggleStorageRequest>) {
  const {name} = action.payload
  const storageOption = yield select(PreferencesSelectors.storage, name)
  const storageStatus = !storageOption ? false : storageOption.status
  if (name === 'autoPinPhotos' && storageStatus === true) {
    // Always start autoPinning only from the date of the latest toggle-on
    const now = (new Date()).getTime()
    yield put(photosActions.updateLastQueriedTime(now))
  }
}
