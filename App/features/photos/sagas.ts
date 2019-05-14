import { all, take, select, call, put, fork, takeEvery } from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'
import { requestLocalPhotos, LocalPhotoResult } from '@textile/react-native-camera-roll'
import Textile, { IThread, IMobilePreparedFiles, IFilesList } from '@textile/react-native-sdk'
import Config from 'react-native-config'
import FS from 'react-native-fs'

import PreferencesActions, { PreferencesSelectors } from '../../Redux/PreferencesRedux'
import TextileEventsActions from '../../Redux/TextileEventsRedux'
import * as actions from './actions'
import * as selectors from './selectors'
import { RootState } from '../../Redux/Types'
import { ProcessingPhoto } from './models'

function * toggleStorage(action: ActionType<typeof PreferencesActions.toggleStorageRequest>) {
  const { name } = action.payload
  const storageOption = yield select(PreferencesSelectors.storage, name)
  const storageStatus = !storageOption ? false : storageOption.status
  if (name === 'autoPinPhotos' && storageStatus === true) {
    // Always start autoPinning only from the date of the latest toggle-on
    const now = (new Date()).getTime()
    yield put(actions.updateLastQueriedTime(now))
  }
}

function * nodeOnline() {
  while (yield take([getType(TextileEventsActions.nodeOnline), getType(TextileEventsActions.stopNodeAfterDelayCancelled)])) {
    yield put(actions.queryCameraRoll.request())
  }
}

function * queryForNewPhotos() {
  while (yield take(getType(actions.queryCameraRoll.request))) {
    try {
      const lastRefresh: number | undefined = yield select((state: RootState) => selectors.lastQueriedTime(state.photos))
      const currentRefresh = (new Date()).getTime()
      // TODO: if we've never queried before, doing this for now until we decide we want to query back in time
      const since = lastRefresh || currentRefresh
      const results: LocalPhotoResult[] = yield call(requestLocalPhotos, since)
      yield put(actions.queryCameraRoll.success(results))
      yield put(actions.updateLastQueriedTime(currentRefresh))
      for (const localPhotoResult of results) {
        yield fork(preparePhoto, localPhotoResult.assetId)
      }
    } catch (error) {
      yield put(actions.queryCameraRoll.failure(error))
    }
  }
}

function * preparePhoto(id: string) {
  try {
    const selector = selectors.makeProcessingPhoto(id)
    const processingPhoto: ProcessingPhoto = yield select((state: RootState) => selector(state.photos))
    const thread: IThread | undefined = yield call(getCameraRollThread)
    if (!thread) {
      throw new Error('no camera roll thread found')
    }
    const preparedFiles: IMobilePreparedFiles = yield call(Textile.files.prepareByPath, processingPhoto.photo.path, thread.id)
    yield put(actions.photoPrepared(id, preparedFiles))
    yield call(addPhoto, id)
  } catch (error) {
    yield put(actions.photoProcessingError(id, error))
  }
}

function * addPhoto(id: string) {
  try {
    const selector = selectors.makeProcessingPhoto(id)
    const processingPhoto: ProcessingPhoto = yield select((state: RootState) => selector(state.photos))
    const thread: IThread | undefined = yield call(getCameraRollThread)
    if (!thread) {
      throw new Error('no camera roll thread found')
    }
    if (!processingPhoto.preparedFiles) {
      throw new Error('no prepared files found')
    }
    yield call(Textile.files.add, processingPhoto.preparedFiles.dir, thread.id)
    yield put(actions.photoAdded(id))
    yield call(cleanup, id)
  } catch (error) {
    yield put(actions.photoProcessingError(id, error))
  }
}

function * cleanup(id: string) {
  const selector = selectors.makeProcessingPhoto(id)
  const processingPhoto: ProcessingPhoto = yield select((state: RootState) => selector(state.photos))
  if (processingPhoto.photo.canDelete) {
    try {
      yield call(FS.unlink, processingPhoto.photo.path)
    } catch {
      // TODO: somthing?
    }
  }
  if (processingPhoto.preparedFiles) {
    for (const key of Object.keys(processingPhoto.preparedFiles.pin)) {
      const path = processingPhoto.preparedFiles.pin[key]
      try {
        yield call(FS.unlink, path)
      } catch {
        // TODO: somthing?
      }
    }
  }
  yield put(actions.photoCleanedUp(id))
}

function * watchForLoadPhotosRequests() {
  while (true) {
    const action: ActionType<typeof actions.refreshPhotos.request> | ActionType<typeof actions.loadMorePhotos.request>
      = yield take([getType(actions.refreshPhotos.request), getType(actions.loadMorePhotos.request)])
    switch (action.type) {
      case getType(actions.refreshPhotos.request): {
        try {
          const filesList: IFilesList = yield call(files, undefined, action.payload)
          yield put(actions.refreshPhotos.success(filesList.items))
        } catch (error) {
          yield put(actions.refreshPhotos.failure({ error }))
        }
        break
      }
      case getType(actions.loadMorePhotos.request): {
        try {
          // TODO: use selector to get offset
          const filesList: IFilesList = yield call(files, undefined, action.payload)
          yield put(actions.loadMorePhotos.success(filesList.items))
        } catch (error) {
          yield put(actions.loadMorePhotos.failure({ error }))
        }
        break
      }
    }
  }
}

export default function *() {
  yield all([
    takeEvery(getType(PreferencesActions.toggleStorageRequest), toggleStorage),
    call(nodeOnline),
    call(queryForNewPhotos),
    call(watchForLoadPhotosRequests)
  ])
}

async function getCameraRollThread() {
  const threads = await Textile.threads.list()
  return threads.items.find((thread) => thread.key === Config.RN_TEXTILE_CAMERA_ROLL_THREAD_KEY)
}

async function files(offset?: string, limit?: number) {
  const thread = await getCameraRollThread()
  if (!thread) {
    throw new Error('no default thread')
  }
  return Textile.files.list(thread.id, offset || '', limit || -1)
}
