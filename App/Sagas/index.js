import { takeLatest, takeEvery, all } from 'redux-saga/effects'

/* ------------- Types ------------- */

import {StartupTypes} from '../Redux/StartupRedux'
import {TextileTypes} from '../Redux/TextileRedux'
import {UITypes} from '../Redux/UIRedux'
import {TextileNodeTypes} from '../Redux/TextileNodeRedux'
import {AuthTypes} from '../Redux/AuthRedux'

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
  pairDevice,
  getPhotoBlocks,
  shareImage,
  photosTask,
  removePayloadFile,
  retryUploadAfterError
} from './TextileSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action

    takeEvery(TextileNodeTypes.APP_STATE_CHANGE, handleNewAppState),

    takeEvery(UITypes.VIEW_PHOTO_REQUEST, viewPhoto),

    takeEvery(AuthTypes.SIGN_UP_REQUEST, signUp),
    takeEvery(AuthTypes.LOG_IN_REQUEST, logIn),
    takeEvery(AuthTypes.RECOVER_PASSWORD_REQUEST, recoverPassword),

    takeEvery(TextileTypes.PAIR_DEVICE, pairDevice),

    takeEvery(TextileNodeTypes.GET_PHOTO_BLOCKS_REQUEST, getPhotoBlocks),

    takeEvery(UITypes.SHARE_PHOTO_REQUEST, shareImage),

    takeEvery(TextileNodeTypes.LOCK, toggleBackgroundTimer),

    takeEvery(TextileNodeTypes.CREATE_NODE_REQUEST, createNode),
    takeEvery(TextileNodeTypes.START_NODE_REQUEST, startNode),
    takeEvery(TextileNodeTypes.STOP_NODE_REQUEST, stopNode),

    // Actions that trigger creating (therefore starting/stopping) the node
    takeEvery(TextileTypes.ONBOARDED_SUCCESS, triggerCreateNode),

    // All things we want to trigger photosTask are funneled through starting the node, so handle START_NODE_SUCCESS
    // by running the photosTask saga here
    takeEvery(TextileNodeTypes.START_NODE_SUCCESS, photosTask),

    takeEvery(TextileTypes.IMAGE_UPLOAD_COMPLETE, removePayloadFile),
    takeEvery(TextileTypes.IMAGE_UPLOAD_ERROR, retryUploadAfterError),

    initializeAppState()
  ])
}
