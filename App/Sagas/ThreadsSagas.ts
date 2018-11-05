/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/
import {Share} from 'react-native'
import { call, put, select, fork } from 'redux-saga/effects'
import ThreadsActions, { ThreadsSelectors } from '../Redux/ThreadsRedux'
import { ActionType } from 'typesafe-actions'
import { BlockId, ExternalInvite, Thread, Threads, ThreadId } from '../Models/TextileTypes'
import TextileNode from '../Services/TextileNode'
import DeepLink from '../Services/DeepLink'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import NavigationService from '../Services/NavigationService'
import UIActions from '../Redux/UIRedux'

export function * addExternalInvite (action: ActionType<typeof ThreadsActions.addExternalInviteRequest>) {
  const { id, name } = action.payload
  try {
    const invite: ExternalInvite = yield call(TextileNode.addExternalThreadInvite, id)
    yield put(ThreadsActions.addExternalInviteSuccess(id, name, invite))
  } catch (error) {
    yield put(ThreadsActions.addExternalInviteError(id, error))
  }
}
export function * displayThreadQRCode (action: ActionType<typeof ThreadsActions.threadQRCodeRequest>) {
  const { id, name } = action.payload
  try {
    const invite: ExternalInvite = yield call(TextileNode.addExternalThreadInvite, id)
    const link = DeepLink.createInviteLink(invite, name)
    yield put(ThreadsActions.threadQRCodeSuccess(id, name, link))
    // displayThreadQRCode
  } catch (error) {
    yield put(ThreadsActions.addExternalInviteError(id, error))
  }
}

export function * presentShareInterface(action: ActionType<typeof ThreadsActions.addExternalInviteSuccess>) {
  const { invite, name } = action.payload
  const link = DeepLink.createInviteLink(invite, name)
  yield call(Share.share, { title: 'Join my thread on Textile!', message: link })
}

export function * acceptExternalInvite (action: ActionType<typeof ThreadsActions.acceptExternalInviteRequest>) {
  const { inviteId, key } = action.payload
  try {
    const threadId: ThreadId = yield call(TextileNode.acceptExternalThreadInvite, inviteId, key)
    yield put(ThreadsActions.acceptExternalInviteSuccess(inviteId, threadId))
    yield put(PhotoViewingActions.refreshThreadsRequest())
  } catch (error) {
    yield put(ThreadsActions.acceptExternalInviteError(inviteId, error))
  }
}

export function * pendingInvitesTask () {
  // Process any pending external invites created while user wasn't logged in
  const pendingInviteLink: string | undefined = yield select(ThreadsSelectors.pendingInviteLink)
  if (pendingInviteLink) {
    yield call(DeepLink.route, pendingInviteLink, NavigationService)
    yield put(ThreadsActions.removeExternalInviteLink())
  }
}

export function * acceptInvite (action: ActionType<typeof ThreadsActions.acceptInviteRequest>) {
  const { notificationId, threadName } = action.payload
  try {
    const threadId = yield call(TextileNode.acceptThreadInviteViaNotification, notificationId)
    const threads: Threads = yield call(TextileNode.threads)
    yield put(PhotoViewingActions.refreshThreadsRequest())
    yield put(UIActions.navigateToThreadRequest(threadId, threadName))
  } catch (error) {
    // TODO: it would be nice to tell the user when they've already joined the thread
  }
}

export function * addInternalInvites (action: ActionType<typeof ThreadsActions.addInternalInvitesRequest>) {
  const { threadId, inviteePks } = action.payload
  try {
    for (const inviteePk of inviteePks) {
      yield fork(TextileNode.addThreadInvite, threadId, inviteePk)
    }
  } catch (error) {
  }
}
