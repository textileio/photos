import { Channel } from 'redux-saga'
import {
  take,
  put,
  all,
  call,
  select,
  fork,
  takeEvery
} from 'redux-saga/effects'
import { getType, ActionType } from 'typesafe-actions'
import Config from 'react-native-config'
import uuid from 'uuid/v4'
import {
  requestLocalPhotos,
  LocalPhotoResult
} from '@textile/react-native-camera-roll'
import Textile, { IThread, IBlock } from '@textile/react-native-sdk'
import RNFS from 'react-native-fs'

import * as actions from './actions'
import * as selectors from './selectors'
import { createQueue } from './queue'
import TextileEventsActions, {
  TextileEventsSelectors
} from '../../../Redux/TextileEventsRedux'
import PreferencesActions, {
  PreferencesSelectors,
  Service
} from '../../../Redux/PreferencesRedux'
import { cameraPermissionsTrigger } from '../../../Services/CameraRoll'
import { ProcessingImage, SharedImagePayload, SharedImage } from './models'
import { RootState } from '../../../Redux/Types'

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

function* triggerCameraRollQuery() {
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
  const pendingPhotos: ProcessingImage[] = yield select((state: RootState) =>
    selectors.pendingPhotos(state.group.addPhoto)
  )
  yield all(
    pendingPhotos.map(photo =>
      put(addTaskChannel, { payload: { id: photo.uuid } })
    )
  )
}

function* queryForNewPhotos(addTaskChannel: Channel<{}>) {
  while (yield take(getType(actions.queryCameraRoll.request))) {
    try {
      const cameraRollThread: IThread | undefined = yield call(
        getCameraRollThread
      )
      if (!cameraRollThread) {
        throw new Error('no camera roll thread found')
      }
      const lastRefresh: number | undefined = yield select((state: RootState) =>
        selectors.lastQueriedTime(state.group.addPhoto)
      )
      const currentRefresh = new Date().getTime()
      const since = lastRefresh || currentRefresh
      const results: LocalPhotoResult[] = yield call(requestLocalPhotos, since)
      const payloads = results.map(
        (localPhoto): SharedImagePayload => {
          const sharedImage: SharedImage = {
            canDelete: localPhoto.canDelete,
            isAvatar: false,
            path: localPhoto.path,
            uri: localPhoto.uri
          }
          return {
            uuid: uuid(),
            sharedImage,
            destinationThreadId: cameraRollThread.id
          }
        }
      )
      yield put(actions.queryCameraRoll.success(payloads))
      // TODO: try catch this
      yield put(actions.updateLastQueriedTime(currentRefresh))
      yield all(
        payloads.map(payload =>
          put(addTaskChannel, { payload: { id: payload.uuid } })
        )
      )
    } catch (error) {
      yield put(actions.queryCameraRoll.failure(error))
    }
  }
}

function* handleSharedPhoto(
  addTaskChannel: Channel<{}>,
  sharedImage: SharedImage,
  destinationThreadId: string,
  comment?: string
) {
  const payload: SharedImagePayload = {
    uuid: uuid(),
    sharedImage,
    destinationThreadId,
    comment
  }
  yield put(actions.insertPhoto(payload))
  try {
    yield put(addTaskChannel, { payload: { id: payload.uuid } })
  } catch (e) {
    yield put(actions.error(payload.uuid, e))
  }
}

function* monitorSharedPhotos(addTaskChannel: Channel<{}>) {
  while (true) {
    const action: ActionType<typeof actions.sharePhotoRequest> = yield take(
      getType(actions.sharePhotoRequest)
    )
    const { sharedImage, destinationThreadId, comment } = action.payload
    yield fork(
      handleSharedPhoto,
      addTaskChannel,
      sharedImage,
      destinationThreadId,
      comment
    )
  }
}

function* handleRetrySharePhoto(addTaskChannel: Channel<{}>, uuid: string) {
  try {
    put(addTaskChannel, { payload: { id: uuid } })
  } catch (e) {
    yield put(actions.error(uuid, e))
  }
}

function* monitorRetrySharePhoto(addTaskChannel: Channel<{}>) {
  while (true) {
    const action: ActionType<typeof actions.retry> = yield take(
      getType(actions.retry)
    )
    const { uuid } = action.payload
    yield fork(handleRetrySharePhoto, addTaskChannel, uuid)
  }
}

function* addPhoto(uuid: string) {
  const selector = (rootState: RootState) =>
    selectors.processingImageByUuidFactory(uuid)(rootState.group.addPhoto)
  const processingImage: ProcessingImage | undefined = yield select(selector)
  if (!processingImage) {
    throw new Error('no ProcessingImage found')
  }
  const blockInfo: IBlock = yield call(
    Textile.files.addFiles,
    processingImage.sharedImage.path,
    processingImage.destinationThreadId,
    processingImage.comment
  )
  yield put(actions.addedToThread(uuid, blockInfo))
  yield put(actions.complete(uuid))
}

function* cleanup(uuid: string) {
  try {
    const selector = (state: RootState) =>
      selectors.processingImageByUuidFactory(uuid)(state.group.addPhoto)
    const processingImage: ProcessingImage | undefined = yield select(selector)
    if (!processingImage) {
      return
    }

    // Delete the shared image if needed
    const exists: boolean = yield call(
      RNFS.exists,
      processingImage.sharedImage.path
    )
    if (exists && processingImage.sharedImage.canDelete) {
      yield call(RNFS.unlink, processingImage.sharedImage.path)
    }

    // What else? Undo local add, remote pin, remove from wallet?
  } catch (error) {}
  yield put(actions.cancelComplete(uuid))
}

function* photoHandler(payload: { id: string }) {
  const { id } = payload
  const online = yield select(TextileEventsSelectors.online)
  if (!online) {
    yield take(getType(TextileEventsActions.nodeOnline))
  }
  try {
    yield put(actions.photoProcessingBegan(id))
    yield call(addPhoto, id)
    yield call(cleanup, id)
  } catch (error) {
    yield put(actions.error(id, error))
  }
}

export function* cancelImageShare(
  action: ActionType<typeof actions.cancelRequest>
) {
  const { uuid } = action.payload
  yield call(cleanup, uuid)
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
  yield fork(monitorSharedPhotos, addTaskChannel)
  yield fork(monitorRetrySharePhoto, addTaskChannel)
}

export default function*() {
  yield all([
    takeEvery(getType(PreferencesActions.toggleStorageRequest), toggleStorage),
    takeEvery(getType(actions.cancelRequest), cancelImageShare),
    call(bootstrapPhotoProcessing),
    call(triggerCameraRollQuery)
  ])
}
