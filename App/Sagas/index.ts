import { takeLatest, takeEvery, all } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

/* ------------- Types ------------- */

import StartupActions from '../Redux/StartupRedux'
import UploadingImagesActions from '../Redux/UploadingImagesRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import UIActions, {UIAction} from '../Redux/UIRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import AuthActions from '../Redux/AuthRedux'
import ThreadsActions from '../Redux/ThreadsRedux'
import DevicesActions from '../Redux/DevicesRedux'
import ContactsActions from '../Redux/ContactsRedux'

/* ------------- Sagas ------------- */

import {startup} from './StartupSagas'
import {
  signUp,
  logIn,
  logOut,
  recoverPassword,
  viewPhoto,
  viewThread,
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
  shareImage,
  removePayloadFile,
  handleUploadError,
  addThread,
  removeThread,
  refreshThreads,
  addExternalInvite,
  presentShareInterface,
  acceptExternalInvite,
  pendingInvitesTask,
  cameraPermissionsTrigger,
  backgroundLocationPermissionsTrigger,
  chooseProfilePhoto,
  handleProfilePhotoSelected,
  presentPublicLinkInterface,
  showImagePicker,
  localPinRequest,
  remotePinRequest,
  nodeOnlineSaga,
} from './TextileSagas'
import CameraRollActions from '../Redux/CameraRollRedux'

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(getType(StartupActions.startup), startup),

    // profile photo
    takeEvery(getType(UIActions.chooseProfilePhotoRequest), chooseProfilePhoto),
    takeEvery(getType(UIActions.selectProfilePicture), handleProfilePhotoSelected),

    // permissions request events
    takeLatest(getType(AuthActions.requestCameraPermissions), cameraPermissionsTrigger),
    takeLatest(getType(AuthActions.requestBackgroundLocationPermissions), backgroundLocationPermissionsTrigger),

    // some sagas receive extra parameters in addition to an action

    takeEvery(getType(TextileNodeActions.appStateChange), handleNewAppState),

    takeEvery(getType(UIActions.viewPhotoRequest), viewPhoto),
    takeEvery(getType(UIActions.viewThreadRequest), viewThread),

    takeEvery(getType(AuthActions.signUpRequest), signUp),
    takeEvery(getType(AuthActions.logInRequest), logIn),
    takeEvery(getType(AuthActions.logOutRequest), logOut),
    takeEvery(getType(AuthActions.recoverPasswordRequest), recoverPassword),

    takeEvery(getType(DevicesActions.addDeviceRequest), addDevice),

    takeEvery(getType(TextileNodeActions.getPhotoHashesRequest), getPhotoHashes),
    takeEvery(getType(UIActions.refreshMessagesRequest), refreshMessages),

    takeEvery(getType(UIActions.sharePhotoRequest), shareImage),

    takeEvery(getType(TextileNodeActions.lock), toggleBackgroundTimer),

    takeEvery(getType(TextileNodeActions.createNodeRequest), createNode),
    takeEvery(getType(TextileNodeActions.startNodeRequest), startNode),
    takeEvery(getType(TextileNodeActions.stopNodeRequest), stopNode),

    // Actions that trigger creating (therefore starting/stopping) the node
    takeEvery(getType(PreferencesActions.onboardedSuccess), triggerCreateNode),

    // If the user clicked any invites before creating an account, this will now flush them...
    takeEvery(getType(TextileNodeActions.startNodeSuccess), pendingInvitesTask),

    takeEvery(getType(UploadingImagesActions.imageUploadComplete), removePayloadFile),
    takeEvery(getType(UploadingImagesActions.imageUploadError), handleUploadError),


    takeEvery(getType(ThreadsActions.addThreadRequest), addThread),
    takeEvery(getType(ThreadsActions.removeThreadRequest), removeThread),

    takeEvery(getType(ThreadsActions.addExternalInviteRequest), addExternalInvite),
    takeEvery(getType(ThreadsActions.addExternalInviteSuccess), presentShareInterface),
    takeEvery(getType(ThreadsActions.acceptExternalInviteRequest), acceptExternalInvite),

    takeEvery(getType(ThreadsActions.refreshThreadsRequest), refreshThreads),

    takeEvery(getType(UIActions.getPublicLink), presentPublicLinkInterface),

    // Flow to add image from ImagePicker to Thread
    // 1. Image picker open request => trigger open image picker
    takeEvery(getType(UIActions.showImagePicker), showImagePicker),
    // Pin the file to our local node
    takeEvery(getType(CameraRollActions.addComment), localPinRequest),
    // Begin upload of the file to the remote pinner
    takeEvery(getType(CameraRollActions.localPinSuccess), remotePinRequest),

    // Update contacts
    takeLatest(getType(TextileNodeActions.nodeOnline), nodeOnlineSaga),
    takeLatest(getType(PreferencesActions.pendingAvatar), nodeOnlineSaga),

    initializeAppState()
  ])
}
