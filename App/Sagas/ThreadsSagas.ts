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
import { delay } from 'redux-saga'
import { call, put, select, fork } from 'redux-saga/effects'
import ThreadsActions from '../Redux/ThreadsRedux'
import { pendingInviteLink } from '../Redux/ThreadsSelectors'
import { ActionType } from 'typesafe-actions'
import {
  pb,
  API
} from '@textile/react-native-sdk'
import DeepLink from '../Services/DeepLink'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import NavigationService from '../Services/NavigationService'
import UIActions from '../Redux/UIRedux'
import Config from 'react-native-config'
import { logNewEvent } from './DeviceLogs'
import { waitUntilOnline } from './NotificationsSagas'

export function * addExternalInvite(action: ActionType<typeof ThreadsActions.addExternalInviteRequest>) {
  const { id, name } = action.payload
  try {
    const invite: pb.IExternalInvite = yield call(API.invites.addExternal, id)
    yield put(ThreadsActions.addExternalInviteSuccess(id, name, invite))
  } catch (error) {
    yield put(ThreadsActions.addExternalInviteError(id, error))
  }
}

export function * displayThreadQRCode(action: ActionType<typeof ThreadsActions.threadQRCodeRequest>) {
  const { id, name } = action.payload
  try {
    const invite: pb.IExternalInvite = yield call(API.invites.addExternal, id)
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

export function * acceptInvite(action: ActionType<typeof ThreadsActions.acceptInviteRequest>) {
  const { notificationId, threadName } = action.payload
  try {
    // don't wait for the join event here...
    yield call(waitUntilOnline, 5000)
    // We'll fork this so that we can Update the UI so user can perceive progress
    yield fork(joinInternalOnFork, notificationId, threadName)
    yield call(delay, 900)
    // After delay, we'll assume we are walking back through the thread... enhancement later
    yield put(ThreadsActions.acceptInviteScanning(notificationId))
    // Refresh in case the head is available
    yield put(PhotoViewingActions.refreshThreadsRequest())
    yield call(NavigationService.navigate, 'Groups')
  } catch (error) {
    yield put(ThreadsActions.acceptInviteError(notificationId, error))
  }
}

function * joinInternalOnFork(notificationId: string, threadName?: string) {
  try {
    const threadId = yield call(API.notifications.acceptInvite, notificationId)
    yield put(PhotoViewingActions.refreshThreadsRequest())
    yield put(ThreadsActions.acceptInviteSuccess(notificationId, threadId))
    // nice with a bit of delay so the app can grab some blocks
    yield call(delay, 500)
    yield put(UIActions.navigateToThreadRequest(threadId, threadName || 'Processing...'))
  } catch (error) {
    yield put(ThreadsActions.acceptInviteError(notificationId, error))
  }
}

export function * acceptExternalInvite(action: ActionType<typeof ThreadsActions.acceptExternalInviteRequest>) {
  const { inviteId, key } = action.payload
  try {
    // don't wait for the join event here...
    yield call(waitUntilOnline, 5000)
    // We'll fork this so that we can Update the UI so user can perceive progress
    yield fork(joinOnFork, inviteId, key)
    yield call(delay, 900)
    // After delay, we'll assume we are walking back through the thread... enhancement later
    yield put(ThreadsActions.acceptInviteScanning(inviteId))
    // Refresh in case the head is available
    yield put(PhotoViewingActions.refreshThreadsRequest())
  } catch (error) {
    yield put(ThreadsActions.acceptInviteError(inviteId, error))
  }
}

function * joinOnFork(inviteId: string, key: string) {
  try {
    // our forked job needs to stay alive so we can get any error message
    const joinId = yield call(API.invites.acceptExternal, inviteId, key)
    // if success, trigger complete and update ui
    yield put(ThreadsActions.acceptInviteSuccess(inviteId, joinId))
    yield put(PhotoViewingActions.refreshThreadsRequest())
  } catch (error) {
    yield put(ThreadsActions.acceptInviteError(inviteId, error))
  }
}

export function * pendingInvitesTask() {
  // Process any pending external invites created while user wasn't logged in
  const inviteLink: string | undefined = yield select(pendingInviteLink)
  if (inviteLink) {
    yield call(DeepLink.route, inviteLink, NavigationService)
    yield put(ThreadsActions.removeExternalInviteLink())
  }
}

export function * cameraRollThreadCreateTask() {
  // Update our camera roll
  try {
    const cameraRollThreadName = 'Camera Roll'
    const cameraRollThreadKey = Config.RN_TEXTILE_CAMERA_ROLL_THREAD_KEY
    const threadsResult: pb.IThreadList = yield call(API.threads.list)
    const cameraRollThread = threadsResult.items.find((thread) => thread.key === cameraRollThreadKey)
    if (cameraRollThread) {
      return
    }
    const config: pb.IAddThreadConfig = {
      key: cameraRollThreadKey,
      name: cameraRollThreadName,
      type: pb.Thread.Type.PRIVATE,
      sharing: pb.Thread.Sharing.NOT_SHARED,
      schema: { id: '', json: '', preset: pb.AddThreadConfig.Schema.Preset.CAMERA_ROLL },
      force: false,
      members: []
    }
    yield call(API.threads.add, config)
  } catch (error) {
    // TODO: the camera sync relies on this tread existing, so if any other besides UNIQUE constraint, we should try again
  }
}

export function * addInternalInvites(action: ActionType<typeof ThreadsActions.addInternalInvitesRequest>) {
  const { threadId, addresses } = action.payload
  try {
    for (const address of addresses) {
      yield call(API.invites.add, threadId, address)
    }
  } catch (error) {
    yield call(logNewEvent, 'addInternalInvites', error.message, true)
  }
}
