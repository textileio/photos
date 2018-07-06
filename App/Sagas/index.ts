import { takeLatest, takeEvery, all } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'

/* ------------- Types ------------- */

import StartupActions from '../Redux/StartupRedux'
import {TextileTypes} from '../Redux/TextileRedux'
import UIActions from '../Redux/UIRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import AuthActions from '../Redux/AuthRedux'
import ThreadsActions from '../Redux/ThreadsRedux'

/* ------------- Sagas ------------- */

import {startup} from './StartupSagas'
import {
  signUp,
  logIn,
  recoverPassword,
  viewPhoto,
  initializeAppState,
  handleNewAppState,
  toggleBackgroundTimer,
  triggerCreateNode,
  createNode,
  startNode,
  stopNode,
  pairNewDevice,
  getPhotoHashes,
  shareImage,
  photosTask,
  removePayloadFile,
  retryUploadAfterError,
  addThread,
  removeThread,
  refreshThreads
} from './TextileSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(getType(StartupActions.startup), startup),

    // some sagas receive extra parameters in addition to an action

    takeEvery(getType(TextileNodeActions.appStateChange), handleNewAppState),

    takeEvery(getType(UIActions.viewPhotoRequest), viewPhoto),

    takeEvery(getType(AuthActions.signUpRequest), signUp),
    takeEvery(getType(AuthActions.logInRequest), logIn),
    takeEvery(getType(AuthActions.recoverPasswordRequest), recoverPassword),

    takeEvery(TextileTypes.PAIR_NEW_DEVICE, pairNewDevice),

    takeEvery(getType(TextileNodeActions.getPhotoHashesRequest), getPhotoHashes),

    takeEvery(getType(UIActions.sharePhotoRequest), shareImage),

    takeEvery(getType(TextileNodeActions.lock), toggleBackgroundTimer),

    takeEvery(getType(TextileNodeActions.createNodeRequest), createNode),
    takeEvery(getType(TextileNodeActions.startNodeRequest), startNode),
    takeEvery(getType(TextileNodeActions.stopNodeRequest), stopNode),

    // Actions that trigger creating (therefore starting/stopping) the node
    takeEvery(TextileTypes.ONBOARDED_SUCCESS, triggerCreateNode),

    // All things we want to trigger photosTask are funneled through starting the node, so handle START_NODE_SUCCESS
    // by running the photosTask saga here
    takeEvery(getType(TextileNodeActions.startNodeSuccess), photosTask),

    takeEvery(TextileTypes.IMAGE_UPLOAD_COMPLETE, removePayloadFile),
    takeEvery(TextileTypes.IMAGE_UPLOAD_ERROR, retryUploadAfterError),

    takeEvery(getType(ThreadsActions.addThreadRequest), addThread),
    takeEvery(getType(ThreadsActions.removeThreadRequest), removeThread),
    takeEvery(getType(ThreadsActions.refreshThreadsRequest), refreshThreads),

    initializeAppState()
  ])
}
