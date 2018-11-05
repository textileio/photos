import { takeLatest, takeEvery, all, call } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

/* ------------- Types ------------- */

import StartupActions from '../Redux/StartupRedux'
import StorageActions from '../Redux/StorageRedux'
import ProcessingImagesActions from '../Redux/ProcessingImagesRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import NotificationsActions from '../Redux/NotificationsRedux'
import UIActions from '../Redux/UIRedux'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import AuthActions from '../Redux/AuthRedux'
import ThreadsActions from '../Redux/ThreadsRedux'
import DevicesActions from '../Redux/DevicesRedux'
import TriggersActions from '../Redux/TriggersRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'

import { manageNode, handleCreateNodeRequest, backgroundFetch, locationUpdate } from './NodeLifecycle'
import { onNodeCreated } from './NodeCreated'
import { onNodeStarted } from './NodeStarted'
import { onNodeOnline } from './NodeOnline'

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
  handleImageUploadError
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
  signUp,
  logIn,
  logOut,
  updateNodeOverview,
  recoverPassword,
  navigateToThread,
  navigateToComments,
  navigateToLikes,
  refreshContacts,
  addFriends,
  addPhotoLike,
  initializeAppState,
  refreshMessages,
  addDevice,
  ignorePhoto,
  cameraPermissionsTrigger,
  chooseProfilePhoto,
  handleProfilePhotoSelected,
  handleProfilePhotoUpdated,
  presentPublicLinkInterface,
  nodeOnlineSaga,
  updateServices
} from './TextileSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    call(manageNode),
    call(handleCreateNodeRequest),
    call(onNodeCreated),
    call(onNodeStarted),
    call(onNodeOnline),
    call(monitorNewThreadActions),

    // some sagas only receive an action
    takeLatest(getType(StartupActions.startup), startup),

    // just for logging purposes
    takeLatest(getType(TriggersActions.backgroundFetch), backgroundFetch),
    takeLatest(getType(TriggersActions.locationUpdate), locationUpdate),
    takeEvery(getType(ProcessingImagesActions.error), handleImageUploadError),

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
    takeEvery(getType(UIActions.refreshContacts), refreshContacts),
    takeEvery(getType(UIActions.addFriendRequest), addFriends),
    takeEvery(getType(UIActions.addLikeRequest), addPhotoLike),

    takeEvery(getType(AuthActions.signUpRequest), signUp),
    takeEvery(getType(AuthActions.logInRequest), logIn),
    takeEvery(getType(AuthActions.logOutRequest), logOut),
    takeEvery(getType(AuthActions.recoverPasswordRequest), recoverPassword),

    takeEvery(getType(DevicesActions.addDeviceRequest), addDevice),

    takeEvery(getType(PhotoViewingActions.addThreadRequest), addThread),
    takeEvery(getType(PhotoViewingActions.removeThreadRequest), removeThread),
    takeEvery(getType(PhotoViewingActions.refreshThreadsRequest), refreshThreads),
    takeEvery(getType(PhotoViewingActions.refreshThreadRequest), refreshThread),
    takeEvery(getType(PhotoViewingActions.addCommentRequest), addPhotoComment),

    takeEvery(getType(TextileNodeActions.ignorePhotoRequest), ignorePhoto),

    call(refreshMessages),
    // check for new images on camera roll
    call(refreshLocalImages),

    // If the user clicked any invites before creating an account, this will now flush them...
    takeEvery(getType(TextileNodeActions.startNodeSuccess), pendingInvitesTask),

    // takeEvery(getType(UploadingImagesActions.imageUploadComplete), removePayloadFile),
    // takeEvery(getType(UploadingImagesActions.imageUploadError), handleUploadError),

    // update the node stats
    takeEvery(getType(TextileNodeActions.updateOverviewRequest), updateNodeOverview),

    takeEvery(getType(ThreadsActions.threadQRCodeRequest), displayThreadQRCode),
    takeEvery(getType(ThreadsActions.addExternalInviteRequest), addExternalInvite),
    takeEvery(getType(ThreadsActions.addExternalInviteSuccess), presentShareInterface),
    takeEvery(getType(ThreadsActions.acceptExternalInviteRequest), acceptExternalInvite),
    takeEvery(getType(ThreadsActions.addInternalInvitesRequest), addInternalInvites),

    takeEvery(getType(ThreadsActions.acceptInviteRequest), acceptInvite),

    takeEvery(getType(UIActions.getPublicLink), presentPublicLinkInterface),

    takeEvery(getType(UIActions.showImagePicker), showImagePicker),
    takeEvery(getType(UIActions.showWalletPicker), showWalletPicker),
    takeEvery(getType(UIActions.walletPickerSuccess), walletPickerSuccess),

    takeEvery(getType(UIActions.sharePhotoRequest), handleSharePhotoRequest),
    takeEvery(getType(ProcessingImagesActions.imageUploadComplete), handleImageUploadComplete),
    takeEvery(getType(ProcessingImagesActions.retry), retryImageShare),
    takeEvery(getType(ProcessingImagesActions.cancelRequest), cancelImageShare),
    takeEvery(getType(ProcessingImagesActions.expiredTokenError), retryWithTokenRefresh),
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
    takeEvery(getType(PreferencesActions.onboardedSuccess), inviteAfterOnboard),

    // Update contacts
    takeLatest(getType(TextileNodeActions.nodeOnline), nodeOnlineSaga),
    takeLatest(getType(PreferencesActions.pendingAvatar), nodeOnlineSaga),

    initializeAppState()
  ])
}
