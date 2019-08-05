import { delay } from 'redux-saga'
import { call, put, select, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import uuid from 'uuid/v4'
import Config from 'react-native-config'

import GroupsActions from '../Redux/GroupsRedux'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import ThreadsActions, { InboundInvite } from '../Redux/ThreadsRedux'
import { inboundInviteByThreadName } from '../Redux/ThreadsSelectors'
import TextileEventsActions from '../Redux/TextileEventsRedux'
import UIActions from '../Redux/UIRedux'
import {
  photoAndComment
} from '../Redux/PhotoViewingSelectors'
import {
  shouldNavigateToNewThread,
  shouldSelectNewThread,
  photoToShareToNewThread
} from '../Redux/GroupsSelectors'
import Textile, {
  IThread,
  IAddThreadConfig,
  AddThreadConfig,
  IThreadList,
  IFiles,
  IFilesList
} from '@textile/react-native-sdk'
import NavigationService from '../Services/NavigationService'
import { shareWalletImage } from './ImageSharingSagas'

export function* monitorNewThreadActions() {
  while (true) {
    const action: ActionType<
      typeof GroupsActions.threadAdded
    > = yield take(getType(GroupsActions.threadAdded))
    const { id, name } = action.payload
    const photoToShare:
      | { threadName: string; imageId: string; comment?: string }
      | undefined = yield select(photoToShareToNewThread)
    const shouldNav: boolean = yield select(shouldNavigateToNewThread)
    const shouldSelect: boolean = yield select(shouldSelectNewThread)
    const invite: InboundInvite | undefined = yield select(
      inboundInviteByThreadName,
      name
    )

    yield put(GroupsActions.clearNewThreadActions())

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

export function* monitorThreadAddedNotifications(
  action: ActionType<typeof GroupsActions.threadAddedNotification>
) {
  try {
    // We need this one because the callback we get from the node doesn't include key. This queries for the thread and gets
    // all the required data for threadAdded()
    const thread: IThread = yield call(Textile.threads.get, action.payload.id)
    const withValid = { ...thread, valid: true }
    yield put(GroupsActions.threadAdded(withValid))
  } catch (error) {
    yield put(
      TextileEventsActions.newErrorMessage(
        'monitorThreadAddedNotifications',
        error.message
      )
    )
    yield put(GroupsActions.addThreadError(error))
  }
}

export function* addThread(
  action: ActionType<typeof GroupsActions.addThreadRequest>
) {
  const { name, whitelist, type, sharing } = action.payload
  const { invites } = action.meta
  try {
    const key = `textile_photos-shared-${uuid()}`
    const config: IAddThreadConfig = {
      key,
      name,
      type,
      sharing,
      schema: { id: '', json: '', preset: AddThreadConfig.Schema.Preset.MEDIA },
      force: false,
      whitelist: whitelist ? (whitelist as string[]) : []
    }
    const threadId: IThread = yield call(Textile.threads.add, config)
    if (invites) {
      yield put(
        ThreadsActions.addInternalInvitesRequest(
          threadId.id,
          invites as string[]
        )
      )
    }
  } catch (error) {
    yield put(TextileEventsActions.newErrorMessage('addThread', error.message))
    yield put(GroupsActions.addThreadError(error))
  }
}

export function* removeThread(
  action: ActionType<typeof GroupsActions.removeThreadRequest>
) {
  const { id } = action.payload
  try {
    yield call(Textile.threads.remove, id)
    yield call(NavigationService.navigate, 'Groups')
  } catch (error) {
    yield put(
      TextileEventsActions.newErrorMessage('removeThread', error.message)
    )
    yield put(GroupsActions.removeThreadError(error))
  }
}

export function* refreshThreads(
  action: ActionType<typeof GroupsActions.refreshThreadsRequest>
) {
  try {
    const threadsResult: IThreadList = yield call(Textile.threads.list)
    for (const thread of threadsResult.items) {
      /**
       * Filters to only threads we want to work with
       */
      const useIt =
        thread.key.indexOf('textile_photos-shared') === 0 ||
        thread.key === Config.RN_TEXTILE_CAMERA_ROLL_THREAD_KEY
      if (useIt) {
        const valid = thread.headBlocks.length > 0
        const withValid = { ...thread, valid }
        yield put(GroupsActions.insertThread(withValid))
        yield put(GroupsActions.refreshThreadRequest(thread.id))
      }
    }
  } catch (error) {
    yield put(
      TextileEventsActions.newErrorMessage('refreshThreads', error.message)
    )
    yield put(GroupsActions.refreshThreadsError(error))
  }
}

export function* refreshThread(
  action: ActionType<typeof GroupsActions.refreshThreadRequest>
) {
  const { threadId } = action.payload
  try {
    const photosResult: IFilesList = yield call(
      Textile.files.list,
      threadId,
      '',
      -1
    )
    yield put(
      GroupsActions.refreshThreadSuccess(threadId, photosResult.items)
    )
  } catch (error) {
    yield put(GroupsActions.refreshThreadError(threadId, error))
  }
}

export function* addPhotoComment(
  action: ActionType<typeof PhotoViewingActions.addCommentRequest>
) {
  const result: {
    photo: IFiles | undefined
    comment: string | undefined
  } = yield select(photoAndComment)
  if (!result.photo || !result.comment) {
    return
  }
  try {
    yield call(Textile.comments.add, result.photo.block, result.comment)
    yield put(PhotoViewingActions.addCommentSuccess())
  } catch (error) {
    yield put(
      TextileEventsActions.newErrorMessage('addPhotoComment', error.message)
    )
    // for now an error will just flush the comment... ideally we can notify the user of a failed comment
    yield put(PhotoViewingActions.addCommentError())
  }
}
