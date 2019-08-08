import {
  take,
  takeLatest,
  takeEvery,
  all,
  call,
  fork,
  select
} from 'redux-saga/effects'
import { PersistedState } from 'redux-persist'
import { getType } from 'typesafe-actions'
import Firebase from 'react-native-firebase'

/* ------------- Types ------------- */

import StartupActions from '../Redux/StartupRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import NotificationsActions from '../Redux/NotificationsRedux'
import UIActions from '../Redux/UIRedux'
import GroupsActions from '../Redux/GroupsRedux'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import AuthActions from '../Redux/AuthRedux'
import ThreadsActions from '../Redux/ThreadsRedux'

/* ------------- Sagas ------------- */

import { accountSaga } from '../features/account'
import { contactsSaga } from '../features/contacts'
import { groupSaga, groupActions } from '../features/group'
import { cafesSaga } from '../features/cafes'

import { startup } from './StartupSagas'

import {
  showImagePicker,
  showWalletPicker,
  walletPickerSuccess,
  handleSharePhotoRequest,
  handleCancel
} from './ImageSharingSagas'

import { inviteAfterOnboard, routeDeepLink } from './DeepLinkSagas'

import {
  handleNewNotification,
  handleEngagement,
  notificationView,
  refreshNotifications,
  reviewThreadInvite,
  readAllNotifications
} from './NotificationsSagas'

import {
  refreshThreads,
  refreshThread,
  monitorThreadAddedNotifications,
  addThread,
  removeThread,
  addPhotoComment,
  monitorNewThreadActions
} from './PhotoViewingSagas'

import {
  displayThreadQRCode,
  addExternalInvite,
  presentShareInterface,
  acceptExternalInvite,
  addInternalInvites,
  pendingInvitesTask,
  acceptInvite
} from './ThreadsSagas'

import {
  navigateToThread,
  navigateToComments,
  navigateToLikes,
  addPhotoLike,
  triggerCameraRollPermission,
  presentPublicLinkInterface,
  updateServices,
  handleToggleVerboseUi
} from './TextileSagas'

import { startSagas } from './TextileEventsSagas'
import TextileEventsActions from '../Redux/TextileEventsRedux'
import { RootAction } from '../Redux/Types'

/* ------------- Connect Types To Sagas ------------- */

function* waitForRehydrate() {
  const rehydrated = (state: PersistedState) => {
    return state._persist ? state._persist.rehydrated : false
  }
  if (yield select(rehydrated)) {
    return
  }
  while (true) {
    yield take('*')
    if (yield select(rehydrated)) {
      return
    }
  }
}

export default function*() {
  yield call(waitForRehydrate)
  yield all([
    call(accountSaga),
    call(contactsSaga),
    call(groupSaga),
    call(cafesSaga),

    call(startSagas),

    call(monitorNewThreadActions),

    // some sagas only receive an action
    takeLatest(getType(StartupActions.startup), startup),

    // permissions request events
    takeLatest(
      getType(AuthActions.requestCameraPermissions),
      triggerCameraRollPermission
    ),
    takeLatest(
      getType(PreferencesActions.toggleServicesRequest),
      updateServices
    ),

    // verbose ui
    takeEvery(
      getType(PreferencesActions.toggleVerboseUi),
      handleToggleVerboseUi
    ),

    takeEvery(getType(UIActions.navigateToThreadRequest), navigateToThread),
    takeEvery(getType(UIActions.navigateToCommentsRequest), navigateToComments),
    takeEvery(getType(UIActions.navigateToLikesRequest), navigateToLikes),
    takeEvery(getType(UIActions.addLike.request), addPhotoLike),

    takeEvery(getType(GroupsActions.addThreadRequest), addThread),
    takeEvery(
      getType(GroupsActions.threadAddedNotification),
      monitorThreadAddedNotifications
    ),
    takeEvery(getType(GroupsActions.removeThreadRequest), removeThread),
    takeEvery(getType(GroupsActions.refreshThreadsRequest), refreshThreads),
    takeEvery(getType(GroupsActions.refreshThreadRequest), refreshThread),
    takeEvery(getType(PhotoViewingActions.addCommentRequest), addPhotoComment),

    // takeEvery(getType(UploadingImagesActions.imageUploadComplete), removePayloadFile),
    // takeEvery(getType(UploadingImagesActions.imageUploadError), handleUploadError),

    /* ------------- SDK ------------- */
    // takeLatest(getType(TriggersActions.backgroundFetch), runBackgroundUpdate),
    /* ------------- End SDK ------------- */

    takeEvery(getType(ThreadsActions.threadQRCodeRequest), displayThreadQRCode),
    takeEvery(
      getType(ThreadsActions.addExternalInviteRequest),
      addExternalInvite
    ),
    takeEvery(
      getType(ThreadsActions.addExternalInviteSuccess),
      presentShareInterface
    ),
    takeEvery(
      getType(ThreadsActions.acceptExternalInviteRequest),
      acceptExternalInvite
    ),
    takeEvery(
      getType(ThreadsActions.addInternalInvitesRequest),
      addInternalInvites
    ),

    takeEvery(getType(ThreadsActions.acceptInviteRequest), acceptInvite),

    takeEvery(getType(UIActions.shareByLink), presentPublicLinkInterface),

    takeEvery(getType(UIActions.showImagePicker), showImagePicker),
    takeEvery(getType(UIActions.showWalletPicker), showWalletPicker),
    takeEvery(getType(UIActions.walletPickerSuccess), walletPickerSuccess),
    takeEvery(getType(UIActions.sharePhotoRequest), handleSharePhotoRequest),
    takeEvery(getType(UIActions.cancelSharingPhoto), handleCancel),

    // Notifications
    takeEvery(
      getType(NotificationsActions.newNotificationRequest),
      handleNewNotification
    ),
    takeEvery(
      getType(NotificationsActions.notificationEngagement),
      handleEngagement
    ),
    takeEvery(
      getType(NotificationsActions.notificationSuccess),
      notificationView
    ),
    takeEvery(
      getType(NotificationsActions.refreshNotificationsRequest),
      refreshNotifications
    ),
    takeEvery(
      getType(NotificationsActions.reviewNotificationThreadInvite),
      reviewThreadInvite
    ),
    takeEvery(
      getType(NotificationsActions.readAllNotificationsRequest),
      readAllNotifications
    ),

    // DeepLinks
    takeEvery(getType(UIActions.routeDeepLinkRequest), routeDeepLink),
    takeEvery(getType(PreferencesActions.onboardingSuccess), inviteAfterOnboard)
  ])
}
