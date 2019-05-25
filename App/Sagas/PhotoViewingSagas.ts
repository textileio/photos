import { delay } from 'redux-saga'
import { call, put, select, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import uuid from 'uuid/v4'

import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import { InboundInvite } from '../Redux/ThreadsRedux'
import { inboundInviteByThreadName } from '../Redux/ThreadsSelectors'
import TextileEventsActions from '../Redux/TextileEventsRedux'
import UIActions from '../Redux/UIRedux'
import {
  photoAndComment,
  shouldNavigateToNewThread,
  shouldSelectNewThread,
  photoToShareToNewThread
} from '../Redux/PhotoViewingSelectors'
import Textile, {
  IThread,
  Thread,
  IAddThreadConfig,
  AddThreadConfig,
  IThreadList,
  IFiles,
  IFilesList
} from '@textile/react-native-sdk'
import NavigationService from '../Services/NavigationService'
import { shareWalletImage } from './ImageSharingSagas'

export function * monitorNewThreadActions() {
  while (true) {
    const action: ActionType<typeof PhotoViewingActions.threadAdded> = yield take(getType(PhotoViewingActions.threadAdded))
    const { id, name } = action.payload
    const photoToShare: { threadName: string, imageId: string, comment?: string} | undefined = yield select(photoToShareToNewThread)
    const shouldNav: boolean = yield select(shouldNavigateToNewThread)
    const shouldSelect: boolean = yield select(shouldSelectNewThread)
    const invite: InboundInvite | undefined = yield select(inboundInviteByThreadName, name)

    yield put(PhotoViewingActions.clearNewThreadActions())

    if (photoToShare && photoToShare.threadName === name) {
      const { imageId, comment } = photoToShare
      yield call(shareWalletImage, imageId, id, comment)
    }

    if (shouldNav) {
      yield put(PhotoViewingActions.viewThread(id))
      yield delay(700)
      yield call(NavigationService.navigate, 'ViewThread', { threadId: id })
    } else if (shouldSelect) {
      yield put(UIActions.updateSharingPhotoThread(id))
    } else if (invite) {
      yield put(PhotoViewingActions.viewThread(id))
      yield call(NavigationService.navigate, 'ViewThread', { threadId: id })
    }
  }
}

export function * monitorThreadAddedNotifications(action: ActionType<typeof PhotoViewingActions.threadAddedNotification>) {
  try {
    // We need this one because the callback we get from the node doesn't include key. This queries for the thread and gets
    // all the required data for threadAdded()
    const thread: IThread = yield call(Textile.threads.get, action.payload.id)
    const { id, key, name, type, sharing, whitelist } = thread
    yield put(PhotoViewingActions.threadAdded(id, key, name, type, sharing, whitelist))
  } catch (error) {
    yield put(TextileEventsActions.newErrorMessage('monitorThreadAddedNotifications', error.message))
    yield put(PhotoViewingActions.addThreadError(error))
  }
}

export function * addThread(action: ActionType<typeof PhotoViewingActions.addThreadRequest>) {
  const { name, whitelist, type, sharing } = action.payload
  try {
    const key = `textile_photos-shared-${uuid()}`
    const config: IAddThreadConfig = {
      key,
      name,
      type,
      sharing,
      schema: { id: '', json: '', preset: AddThreadConfig.Schema.Preset.MEDIA },
      force: false,
      whitelist: whitelist ? whitelist as string[] : []
    }
    yield call(Textile.threads.add, config)
  } catch (error) {
    yield put(TextileEventsActions.newErrorMessage('addThread', error.message))
    yield put(PhotoViewingActions.addThreadError(error))
  }
}

export function * removeThread(action: ActionType<typeof PhotoViewingActions.removeThreadRequest>) {
  const { id } = action.payload
  try {
    yield call(Textile.threads.remove, id)
    yield call(NavigationService.navigate, 'Groups')
  } catch (error) {
    yield put(TextileEventsActions.newErrorMessage('removeThread', error.message))
    yield put(PhotoViewingActions.removeThreadError(error))
  }
}

export function * refreshThreads(action: ActionType<typeof PhotoViewingActions.refreshThreadsRequest>) {
  try {
    const threadsResult: IThreadList = yield call(Textile.threads.list)
    for (const thread of threadsResult.items) {
      /**
       * Filters to only shared threads
       */
      const isSharedThread = thread.key.indexOf('textile_photos-shared') === 0
      if (isSharedThread) {
        yield put(PhotoViewingActions.insertThread(thread.id, thread.key, thread.name, thread.type, thread.sharing, thread.whitelist))
        yield put(PhotoViewingActions.refreshThreadRequest(thread.id))
      }
    }
  } catch (error) {
    yield put(TextileEventsActions.newErrorMessage('refreshThreads', error.message))
    yield put(PhotoViewingActions.refreshThreadsError(error))
  }
}

export function * refreshThread(action: ActionType<typeof PhotoViewingActions.refreshThreadRequest>) {
  const { threadId } = action.payload
  try {
    const photosResult: IFilesList = yield call(Textile.files.list, threadId, '', -1)
    yield put(PhotoViewingActions.refreshThreadSuccess(threadId, photosResult.items))
  } catch (error) {
    yield put(PhotoViewingActions.refreshThreadError(threadId, error))
  }
}

export function * addPhotoComment(action: ActionType<typeof PhotoViewingActions.addCommentRequest>) {
  const result: { photo: IFiles | undefined, comment: string | undefined } = yield select(photoAndComment)
  if (!result.photo || !result.comment) {
    return
  }
  try {
    yield call(Textile.comments.add, result.photo.block, result.comment)
    yield put(PhotoViewingActions.addCommentSuccess())
  } catch (error) {
    yield put(TextileEventsActions.newErrorMessage('addPhotoComment', error.message))
    // for now an error will just flush the comment... ideally we can notify the user of a failed comment
    yield put(PhotoViewingActions.addCommentError())
  }
}
