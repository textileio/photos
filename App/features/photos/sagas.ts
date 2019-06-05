import { buffers, channel, Channel } from 'redux-saga'
import {
  all,
  take,
  select,
  call,
  put,
  fork,
  takeEvery,
  cancelled
} from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'
import {
  requestLocalPhotos,
  LocalPhotoResult
} from '@textile/react-native-camera-roll'
import Textile, {
  IThread,
  IMobilePreparedFiles,
  IFilesList
} from '@textile/react-native-sdk'
import Config from 'react-native-config'
import FS from 'react-native-fs'

import { cameraPermissionsTrigger } from '../../Services/CameraRoll'
import PreferencesActions, {
  PreferencesSelectors,
  Service
} from '../../Redux/PreferencesRedux'
import TextileEventsActions, {
  TextileEventsSelectors
} from '../../Redux/TextileEventsRedux'
import * as actions from './actions'
import * as selectors from './selectors'
import { RootState } from '../../Redux/Types'
import { ProcessingPhoto } from './models'

async function getCameraRollThread() {
  const threads = await Textile.threads.list()
  return threads.items.find(
    thread => thread.key === Config.RN_TEXTILE_CAMERA_ROLL_THREAD_KEY
  )
}

function* toggleStorage(
  action: ActionType<typeof PreferencesActions.toggleStorageRequest>
) {
  const { name } = action.payload
  const storageOption: Service = yield select(
    PreferencesSelectors.storage,
    name
  )
  if (name === 'autoPinPhotos' && storageOption.status === true) {
    // Always start autoPinning only from the date of the latest toggle-on
    const now = new Date().getTime()
    yield put(actions.updateLastQueriedTime(now))
    yield call(cameraPermissionsTrigger)
  }
}

function* nodeStarted() {
  while (
    yield take([
      getType(TextileEventsActions.nodeStarted),
      getType(TextileEventsActions.stopNodeAfterDelayCancelled)
    ])
  ) {
    const autoPinService: Service = yield select(
      PreferencesSelectors.storage,
      'autoPinPhotos'
    )
    if (autoPinService.status) {
      yield put(actions.queryCameraRoll.request())
    }
  }
}

function* processPending(addTaskChannel: Channel<{}>) {
  const pendingPhotos: ProcessingPhoto[] = yield select((state: RootState) =>
    selectors.pendingPhotos(state.photos)
  )
  yield all(
    pendingPhotos.map(photo =>
      put(addTaskChannel, { payload: { id: photo.photo.assetId } })
    )
  )
}

function* queryForNewPhotos(addTaskChannel: Channel<{}>) {
  while (yield take(getType(actions.queryCameraRoll.request))) {
    try {
      const lastRefresh: number | undefined = yield select((state: RootState) =>
        selectors.lastQueriedTime(state.photos)
      )
      const currentRefresh = new Date().getTime()
      // TODO: if we've never queried before, doing this for now until we decide we want to query back in time
      const since = lastRefresh || currentRefresh
      const results: LocalPhotoResult[] = yield call(requestLocalPhotos, since)
      yield put(actions.queryCameraRoll.success(results))
      yield put(actions.updateLastQueriedTime(currentRefresh))
      yield all(
        results.map(result =>
          put(addTaskChannel, { payload: { id: result.assetId } })
        )
      )
    } catch (error) {
      yield put(actions.queryCameraRoll.failure(error))
    }
  }
}

function* createQueue(
  handle: (...args: any[]) => IterableIterator<any>,
  concurrent = 1
) {
  const addTaskChannel: Channel<{}> = yield call(channel, buffers.expanding())
  // create a channel to queue incoming requests
  const runChannel: Channel<{}> = yield call(channel, buffers.expanding())

  function* handleRequest(chan: Channel<{}>) {
    while (true) {
      const payload = yield take(chan)
      yield handle(payload)
    }
  }

  function* watchRequests() {
    try {
      // create n worker 'threads'
      yield all(Array(concurrent).fill(fork(handleRequest, runChannel)))

      while (true) {
        const { payload } = yield take(addTaskChannel)
        yield put(runChannel, payload)
      }
    } finally {
      if (yield cancelled()) {
        addTaskChannel.close()
        runChannel.close()
      }
    }
  }

  return {
    watcher: watchRequests,
    addTaskChannel
  }
}

function* preparePhoto(id: string) {
  const selector = selectors.makeProcessingPhoto(id)
  const processingPhoto: ProcessingPhoto = yield select((state: RootState) =>
    selector(state.photos)
  )
  const thread: IThread | undefined = yield call(getCameraRollThread)
  if (!thread) {
    throw new Error('no camera roll thread found')
  }
  const preparedFiles: IMobilePreparedFiles = yield call(
    Textile.files.prepareByPath,
    processingPhoto.photo.path,
    thread.id
  )
  yield put(actions.photoPrepared(id, preparedFiles))
}

function* addPhoto(id: string) {
  const selector = selectors.makeProcessingPhoto(id)
  const processingPhoto: ProcessingPhoto = yield select((state: RootState) =>
    selector(state.photos)
  )
  const thread: IThread | undefined = yield call(getCameraRollThread)
  if (!thread) {
    throw new Error('no camera roll thread found')
  }
  if (!processingPhoto.preparedFiles) {
    throw new Error('no prepared files found')
  }
  yield call(Textile.files.add, processingPhoto.preparedFiles.dir, thread.id)
  yield put(actions.photoAdded(id))
}

function* cleanup(id: string) {
  const selector = selectors.makeProcessingPhoto(id)
  const processingPhoto: ProcessingPhoto = yield select((state: RootState) =>
    selector(state.photos)
  )
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

function* photoHandler(payload: { id: string }) {
  const { id } = payload
  const online = yield select(TextileEventsSelectors.online)
  if (!online) {
    yield take(getType(TextileEventsActions.nodeOnline))
  }
  try {
    yield put(actions.photoProcessingBegan(id))
    yield call(preparePhoto, id)
    yield call(addPhoto, id)
    yield call(cleanup, id)
  } catch (error) {
    yield put(actions.photoProcessingError(id, error))
  }
}

function* bootstrapPhotoProcessing() {
  const QUEUE_CONCURRENT = 1
  const { watcher, addTaskChannel } = yield createQueue(
    photoHandler,
    QUEUE_CONCURRENT
  )
  yield fork(watcher)
  yield call(processPending, addTaskChannel)
  yield fork(queryForNewPhotos, addTaskChannel)
}

async function files(offset?: string, limit?: number) {
  const thread = await getCameraRollThread()
  if (!thread) {
    throw new Error('no default thread')
  }
  return Textile.files.list(thread.id, offset || '', limit || -1)
}

function* watchForLoadPhotosRequests() {
  while (true) {
    const action:
      | ActionType<typeof actions.refreshPhotos.request>
      | ActionType<typeof actions.loadMorePhotos.request> = yield take([
      getType(actions.refreshPhotos.request),
      getType(actions.loadMorePhotos.request)
    ])
    switch (action.type) {
      case getType(actions.refreshPhotos.request): {
        try {
          const filesList: IFilesList = yield call(
            files,
            undefined,
            action.payload
          )
          yield put(actions.refreshPhotos.success(filesList.items))
        } catch (error) {
          yield put(actions.refreshPhotos.failure({ error }))
        }
        break
      }
      case getType(actions.loadMorePhotos.request): {
        try {
          // TODO: use selector to get offset
          const filesList: IFilesList = yield call(
            files,
            undefined,
            action.payload
          )
          yield put(actions.loadMorePhotos.success(filesList.items))
        } catch (error) {
          yield put(actions.loadMorePhotos.failure({ error }))
        }
        break
      }
    }
  }
}

export default function*() {
  yield all([
    takeEvery(getType(PreferencesActions.toggleStorageRequest), toggleStorage),
    call(nodeStarted),
    call(bootstrapPhotoProcessing),
    call(watchForLoadPhotosRequests)
  ])
}
