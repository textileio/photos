import { takeLatest, takeEvery, all } from 'redux-saga/effects'

/* ------------- Types ------------- */

import {StartupTypes} from '../Redux/StartupRedux'
import {TextileTypes} from '../Redux/TextileRedux'
import {UITypes} from '../Redux/UIRedux'
import {IpfsNodeTypes} from '../Redux/IpfsNodeRedux'
import {AuthTypes} from '../Redux/AuthRedux'

/* ------------- Sagas ------------- */

import {startup} from './StartupSagas'
import {
  signUp,
  logIn,
  recoverPassword,
  viewPhoto,
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
  removePayloadFile
} from './TextileSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeEvery(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action

    takeEvery(IpfsNodeTypes.APP_STATE_CHANGE, handleNewAppState),

    takeEvery(UITypes.VIEW_PHOTO_REQUEST, viewPhoto),

    takeEvery(AuthTypes.SIGN_UP_REQUEST, signUp),
    takeEvery(AuthTypes.LOG_IN_REQUEST, logIn),
    takeEvery(AuthTypes.RECOVER_PASSWORD_REQUEST, recoverPassword),

    takeEvery(TextileTypes.PAIR_NEW_DEVICE, pairNewDevice),

    takeEvery(IpfsNodeTypes.GET_PHOTO_HASHES_REQUEST, getPhotoHashes),

    takeEvery(UITypes.SHARE_PHOTO_REQUEST, shareImage),

    takeEvery(IpfsNodeTypes.LOCK, toggleBackgroundTimer),

    takeEvery(IpfsNodeTypes.CREATE_NODE_REQUEST, createNode),
    takeEvery(IpfsNodeTypes.START_NODE_REQUEST, startNode),
    takeEvery(IpfsNodeTypes.STOP_NODE_REQUEST, stopNode),

    // Actions that trigger creating (therefore starting/stopping) the node
    // takeEvery(action => action.type === IpfsNodeTypes.APP_STATE_CHANGE && action.newState === 'active', triggerCreateNode),
    takeEvery(StartupTypes.STARTUP, triggerCreateNode),
    takeEvery(TextileTypes.LOCATION_UPDATE, triggerCreateNode),
    takeEvery(TextileTypes.BACKGROUND_TASK, triggerCreateNode),
    takeEvery(TextileTypes.ONBOARDED_SUCCESS, triggerCreateNode),

    // Actions that trigger stopping the node
    // takeEvery(action => action.type === IpfsNodeTypes.APP_STATE_CHANGE && action.newState === 'background', triggerStopNode),

    // All things we want to trigger photosTask are funneled through starting the node, so handle START_NODE_SUCCESS
    // by running the photosTask saga here
    takeEvery(IpfsNodeTypes.START_NODE_SUCCESS, photosTask),

    takeEvery(TextileTypes.IMAGE_UPLOAD_COMPLETE, removePayloadFile)
  ])
}
