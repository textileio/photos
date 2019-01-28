import { takeLatest, takeEvery, all, call } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { Dispatch } from 'redux'

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
import TriggersActions from '../Redux/TriggersRedux'
import ContactsActions from '../Redux/ContactsRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'

import { runRecurringMigrationTasks, handleMigrationRequest, handleCancelMigration, handleRetryMigration } from './Migration'

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
  refreshContacts,
  addFriends,
  addPhotoLike,
  cameraPermissionsTrigger,
  chooseProfilePhoto,
  handleProfilePhotoSelected,
  handleProfilePhotoUpdated,
  presentPublicLinkInterface,
  updateServices
} from './TextileSagas'

/* ------------- SDK Imports ------------- */

import accountSaga from './Account'
import * as MockBridge from './MockBridge'
import * as NodeLifecycle from './NodeLifecycle'
import * as NodeStarted from './NodeStarted'
import * as NodeOnline from './NodeOnline'
import * as TextileSDK from './SDKSagas'

/* ------------- End SDK Imports ------------- */

/* ------------- Connect Types To Sagas ------------- */

export default function * root (dispatch: Dispatch) {
  yield all([

    call(monitorNewThreadActions),

    call(startMonitoringExistingUploads),

    call(runRecurringMigrationTasks),
    call(handleMigrationRequest, dispatch),
    call(handleCancelMigration),
    call(handleRetryMigration, dispatch),

    // some sagas only receive an action
    takeLatest(getType(StartupActions.startup), startup),

    // just for logging purposes
    takeEvery(getType(ProcessingImagesActions.error), handleImageProcessingError),

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
    takeEvery(getType(UIActions.addFriendRequest), addFriends),
    takeEvery(getType(UIActions.addLikeRequest), addPhotoLike),

    takeEvery(getType(ContactsActions.getContactsRequest), refreshContacts),

    takeEvery(getType(PhotoViewingActions.addThreadRequest), addThread),
    takeEvery(getType(PhotoViewingActions.threadAddedNotification), monitorThreadAddedNotifications),
    takeEvery(getType(PhotoViewingActions.removeThreadRequest), removeThread),
    takeEvery(getType(PhotoViewingActions.refreshThreadsRequest), refreshThreads),
    takeEvery(getType(PhotoViewingActions.refreshThreadRequest), refreshThread),
    takeEvery(getType(PhotoViewingActions.addCommentRequest), addPhotoComment),

    takeEvery(getType(TextileNodeActions.ignoreFileRequest), TextileSDK.ignoreFile),

    // check for new images on camera roll
    call(refreshLocalImages),

    // takeEvery(getType(UploadingImagesActions.imageUploadComplete), removePayloadFile),
    // takeEvery(getType(UploadingImagesActions.imageUploadError), handleUploadError),

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
    takeEvery(getType(ProcessingImagesActions.imageUploadComplete), handleImageUploadComplete),
    takeEvery(getType(ProcessingImagesActions.retry), retryImageShare),
    takeEvery(getType(ProcessingImagesActions.cancelRequest), cancelImageShare),
    takeEvery(getType(ProcessingImagesActions.error), retryWithTokenRefresh),
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
    takeEvery(getType(PreferencesActions.onboardingSuccess), inviteAfterOnboard),

    /* ------------- SDK ------------- */
    call(NodeStarted.onNodeStarted),
    call(NodeOnline.onNodeOnline),
    call(accountSaga),
    call(NodeLifecycle.manageNode),
    call(NodeLifecycle.handleCreateNodeRequest, dispatch),
    call(TextileSDK.refreshMessages),
    call(MockBridge.mockEvents),
    takeLatest(getType(TriggersActions.backgroundFetch), NodeLifecycle.backgroundFetch),
    takeLatest(getType(TriggersActions.locationUpdate), NodeLifecycle.locationUpdate),
    // If the user clicked any invites before creating an account, this will now flush them...
    takeEvery(getType(TextileNodeActions.startNodeSuccess), pendingInvitesTask),
    takeLatest(getType(TextileNodeActions.nodeOnline), NodeOnline.nodeOnlineSaga),
    TextileSDK.initializeAppState()
    /* ------------- End SDK ------------- */
  ])
}
