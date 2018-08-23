import { takeLatest, takeEvery, all, take } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

/* ------------- Types ------------- */

import StartupActions from '../Redux/StartupRedux'
import ProcessingImagesActions from '../Redux/ProcessingImagesRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import NotificationsActions from '../Redux/NotificationsRedux'
import UIActions from '../Redux/UIRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import AuthActions from '../Redux/AuthRedux'
import ThreadsActions from '../Redux/ThreadsRedux'
import DevicesActions from '../Redux/DevicesRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'

import { manageNode } from './NodeLifecycle'

import {
  handleSharePhotoRequest,
  handleImageUploadComplete,
  retryImageShare,
  cancelImageShare
} from './ImageSharingTriggers'

import {
  routeDeepLink
} from './DeepLinkSagas'

import {
  handleNewNotification,
  handleEngagement,
  notificationView,
  refreshNotifications,
  reviewThreadInvite
} from './NotificationsSagas'

import {
  addThread,
  removeThread,
  refreshThreads,
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
  recoverPassword,
  viewPhoto,
  viewThread,
  addFriends,
  initializeAppState,
  handleNewAppState,
  toggleBackgroundTimer,
  triggerCreateNode,
  createNode,
  startNode,
  stopNode,
  refreshMessages,
  addDevice,
  getPhotoHashes,
  ignorePhoto,
  cameraPermissionsTrigger,
  chooseProfilePhoto,
  handleProfilePhotoSelected,
  handleProfilePhotoUpdated,
  presentPublicLinkInterface,
  showImagePicker,
  nodeOnlineSaga,
  updateServices
} from './TextileSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    manageNode(),

    // some sagas only receive an action
    takeLatest(getType(StartupActions.startup), startup),

    // profile photo
    takeEvery(getType(UIActions.chooseProfilePhotoRequest), chooseProfilePhoto),
    takeEvery(getType(UIActions.selectProfilePicture), handleProfilePhotoSelected),
    takeEvery(getType(UIActions.updateProfilePicture), handleProfilePhotoUpdated),

    // permissions request events
    takeLatest(getType(AuthActions.requestCameraPermissions), cameraPermissionsTrigger),
    takeLatest(getType(PreferencesActions.toggleServicesRequest), updateServices),

    // some sagas receive extra parameters in addition to an action

    takeEvery(getType(TextileNodeActions.appStateChange), handleNewAppState),

    takeEvery(getType(UIActions.viewPhotoRequest), viewPhoto),
    takeEvery(getType(UIActions.viewThreadRequest), viewThread),
    takeEvery(getType(UIActions.addFriendRequest), addFriends),

    takeEvery(getType(AuthActions.signUpRequest), signUp),
    takeEvery(getType(AuthActions.logInRequest), logIn),
    takeEvery(getType(AuthActions.logOutRequest), logOut),
    takeEvery(getType(AuthActions.recoverPasswordRequest), recoverPassword),

    takeEvery(getType(DevicesActions.addDeviceRequest), addDevice),

    takeEvery(getType(TextileNodeActions.getPhotoHashesRequest), getPhotoHashes),
    takeEvery(getType(TextileNodeActions.ignorePhotoRequest), ignorePhoto),

    takeEvery(getType(TextileNodeActions.refreshMessagesRequest), refreshMessages),

    takeEvery(getType(TextileNodeActions.lock), toggleBackgroundTimer),

    takeEvery(getType(TextileNodeActions.createNodeRequest), createNode),
    takeEvery(getType(TextileNodeActions.startNodeRequest), startNode),
    takeEvery(getType(TextileNodeActions.stopNodeRequest), stopNode),

    // Actions that trigger creating (therefore starting/stopping) the node
    takeEvery(getType(PreferencesActions.onboardedSuccess), triggerCreateNode),

    // If the user clicked any invites before creating an account, this will now flush them...
    takeEvery(getType(TextileNodeActions.startNodeSuccess), pendingInvitesTask),

    // takeEvery(getType(UploadingImagesActions.imageUploadComplete), removePayloadFile),
    // takeEvery(getType(UploadingImagesActions.imageUploadError), handleUploadError),


    takeEvery(getType(ThreadsActions.addThreadRequest), addThread),
    takeEvery(getType(ThreadsActions.removeThreadRequest), removeThread),

    takeEvery(getType(ThreadsActions.addExternalInviteRequest), addExternalInvite),
    takeEvery(getType(ThreadsActions.addExternalInviteSuccess), presentShareInterface),
    takeEvery(getType(ThreadsActions.acceptExternalInviteRequest), acceptExternalInvite),
    takeEvery(getType(ThreadsActions.addInternalInvitesRequest), addInternalInvites),

    takeEvery(getType(ThreadsActions.refreshThreadsRequest), refreshThreads),
    takeEvery(getType(ThreadsActions.acceptInviteRequest), acceptInvite),

    takeEvery(getType(UIActions.getPublicLink), presentPublicLinkInterface),

    takeEvery(getType(UIActions.showImagePicker), showImagePicker),

    takeEvery(getType(UIActions.sharePhotoRequest), handleSharePhotoRequest),
    takeEvery(getType(ProcessingImagesActions.imageUploadComplete), handleImageUploadComplete),
    takeEvery(getType(ProcessingImagesActions.retry), retryImageShare),
    takeEvery(getType(ProcessingImagesActions.cancelRequest), cancelImageShare),

    // Notifications
    takeEvery(getType(NotificationsActions.newNotificationRequest), handleNewNotification),
    takeEvery(getType(NotificationsActions.notificationEngagement), handleEngagement),
    takeEvery(getType(NotificationsActions.notificationSuccess), notificationView),
    takeEvery(getType(NotificationsActions.refreshNotificationsRequest), refreshNotifications),
    takeEvery(getType(NotificationsActions.reviewNotificationThreadInvite), reviewThreadInvite),

    // DeepLinks
    takeEvery(getType(UIActions.routeDeepLinkRequest), routeDeepLink),

    // Update contacts
    takeLatest(getType(TextileNodeActions.nodeOnline), nodeOnlineSaga),
    takeLatest(getType(PreferencesActions.pendingAvatar), nodeOnlineSaga),

    initializeAppState()
  ])
}
