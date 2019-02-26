import { takeLatest, takeEvery, all, call } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { Dispatch } from 'redux'

/* ------------- Types ------------- */

import StartupActions from '../Redux/StartupRedux'
import StorageActions from '../Redux/StorageRedux'
import { groupActions } from '../features/group'
import PreferencesActions from '../Redux/PreferencesRedux'
import NotificationsActions from '../Redux/NotificationsRedux'
import UIActions from '../Redux/UIRedux'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import AuthActions from '../Redux/AuthRedux'
import ThreadsActions from '../Redux/ThreadsRedux'
import TriggersActions from '../Redux/TriggersRedux'

/* ------------- Sagas ------------- */

import accountSaga from './Account'
import { contactsSaga } from '../features/contacts'
import { groupSaga } from '../features/group'

import { startup } from './StartupSagas'

import {
  onNodeStarted
} from './Account/AccountSagas'

import {
  showImagePicker,
  showWalletPicker,
  walletPickerSuccess
} from './ImageSharingSagas'

import {
  handleSharePhotoRequest,
  handleImageUploadComplete,
  retryImageShare,
  cancelImageShare,
  retryWithTokenRefresh,
  handleImageProcessingError,
  startMonitoringExistingUploads
} from './ImageSharingTriggers'

import {
  inviteAfterOnboard,
  routeDeepLink
} from './DeepLinkSagas'

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
  newLocalPhoto,
  refreshLocalImages,
  toggleStorage
} from './StorageSagas'

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
  cameraPermissionsTrigger,
  chooseProfilePhoto,
  handleProfilePhotoSelected,
  handleProfilePhotoUpdated,
  presentPublicLinkInterface,
  updateServices
} from './TextileSagas'

import {
  runBackgroundUpdate,
  startSagas
} from './TextileEventsSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * root (dispatch: Dispatch) {
  yield all([
    call(accountSaga),
    call(contactsSaga),
    call(groupSaga),

    call(startSagas),

    call(monitorNewThreadActions),

    call(startMonitoringExistingUploads),

    // some sagas only receive an action
    takeLatest(getType(StartupActions.startup), startup),

    // just for logging purposes
    takeEvery(getType(groupActions.addPhoto.error), handleImageProcessingError),

    // profile photo
    takeEvery(getType(UIActions.chooseProfilePhotoRequest), chooseProfilePhoto),
    takeEvery(getType(UIActions.selectProfilePicture), handleProfilePhotoSelected),
    takeEvery(getType(UIActions.updateProfilePicture), handleProfilePhotoUpdated),

    // permissions request events
    takeLatest(getType(AuthActions.requestCameraPermissions), cameraPermissionsTrigger),
    takeLatest(getType(PreferencesActions.toggleServicesRequest), updateServices),
    takeLatest(getType(PreferencesActions.toggleStorageRequest), toggleStorage),

    takeEvery(getType(UIActions.navigateToThreadRequest), navigateToThread),
    takeEvery(getType(UIActions.navigateToCommentsRequest), navigateToComments),
    takeEvery(getType(UIActions.navigateToLikesRequest), navigateToLikes),
    takeEvery(getType(UIActions.addLikeRequest), addPhotoLike),

    takeEvery(getType(PhotoViewingActions.addThreadRequest), addThread),
    takeEvery(getType(PhotoViewingActions.threadAddedNotification), monitorThreadAddedNotifications),
    takeEvery(getType(PhotoViewingActions.removeThreadRequest), removeThread),
    takeEvery(getType(PhotoViewingActions.refreshThreadsRequest), refreshThreads),
    takeEvery(getType(PhotoViewingActions.refreshThreadRequest), refreshThread),
    takeEvery(getType(PhotoViewingActions.addCommentRequest), addPhotoComment),

    // check for new images on camera roll
    call(refreshLocalImages),

    // takeEvery(getType(UploadingImagesActions.imageUploadComplete), removePayloadFile),
    // takeEvery(getType(UploadingImagesActions.imageUploadError), handleUploadError),

    /* ------------- SDK ------------- */
    takeLatest(getType(TriggersActions.backgroundFetch), runBackgroundUpdate),
    takeLatest(getType(TriggersActions.locationUpdate), runBackgroundUpdate),
    /* ------------- End SDK ------------- */

    takeEvery(getType(ThreadsActions.threadQRCodeRequest), displayThreadQRCode),
    takeEvery(getType(ThreadsActions.addExternalInviteRequest), addExternalInvite),
    takeEvery(getType(ThreadsActions.addExternalInviteSuccess), presentShareInterface),
    takeEvery(getType(ThreadsActions.acceptExternalInviteRequest), acceptExternalInvite),
    takeEvery(getType(ThreadsActions.addInternalInvitesRequest), addInternalInvites),

    takeEvery(getType(ThreadsActions.acceptInviteRequest), acceptInvite),

    takeEvery(getType(UIActions.shareByLink), presentPublicLinkInterface),

    takeEvery(getType(UIActions.showImagePicker), showImagePicker),
    takeEvery(getType(UIActions.showWalletPicker), showWalletPicker),
    takeEvery(getType(UIActions.walletPickerSuccess), walletPickerSuccess),

    takeEvery(getType(UIActions.sharePhotoRequest), handleSharePhotoRequest),
    takeEvery(getType(groupActions.addPhoto.imageUploadComplete), handleImageUploadComplete),
    takeEvery(getType(groupActions.addPhoto.retry), retryImageShare),
    takeEvery(getType(groupActions.addPhoto.cancelRequest), cancelImageShare),
    takeEvery(getType(groupActions.addPhoto.error), retryWithTokenRefresh),
    takeEvery(getType(StorageActions.newLocalPhoto), newLocalPhoto),

    // Notifications
    takeEvery(getType(NotificationsActions.newNotificationRequest), handleNewNotification),
    takeEvery(getType(NotificationsActions.notificationEngagement), handleEngagement),
    takeEvery(getType(NotificationsActions.notificationSuccess), notificationView),
    takeEvery(getType(NotificationsActions.refreshNotificationsRequest), refreshNotifications),
    takeEvery(getType(NotificationsActions.reviewNotificationThreadInvite), reviewThreadInvite),
    takeEvery(getType(NotificationsActions.readAllNotificationsRequest), readAllNotifications),

    // DeepLinks
    takeEvery(getType(UIActions.routeDeepLinkRequest), routeDeepLink),
    takeEvery(getType(PreferencesActions.onboardingSuccess), inviteAfterOnboard)
  ])
}
