import { takeLatest, takeEvery, all, select } from 'redux-saga/effects'

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
  triggerStartNode,
  handleStateChange,
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
    takeLatest(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action

    takeEvery(AuthTypes.SIGN_UP_REQUEST, signUp),
    takeEvery(AuthTypes.LOG_IN_REQUEST, logIn),
    takeEvery(AuthTypes.RECOVER_PASSWORD_REQUEST, recoverPassword),

    takeLatest(TextileTypes.PAIR_NEW_DEVICE, pairNewDevice),

    takeEvery(IpfsNodeTypes.GET_PHOTO_HASHES_REQUEST, getPhotoHashes),

    takeEvery(UITypes.SHARE_PHOTO_REQUEST, shareImage),

    // Actions that trigger starting/stopping the node
    takeEvery(action => action.type === TextileTypes.APP_STATE_CHANGE && action.newState !== 'background', handleStateChange),
    takeEvery(TextileTypes.LOCATION_UPDATE, triggerStartNode),
    takeEvery(TextileTypes.BACKGROUND_TASK, triggerStartNode),
    takeEvery(TextileTypes.ONBOARDED_SUCCESS, triggerStartNode),

    // Actions triggered by the items above, start/stop the node, will emit START_NODE_SUCCESS/FAILURE
    takeLatest(IpfsNodeTypes.START_NODE_REQUEST, startNode),
    takeLatest(IpfsNodeTypes.STOP_NODE_REQUEST, stopNode),

    // All things we want to trigger photosTask are funneled through starting the node, so handle START_NODE_SUCCESS
    // by running the photosTask saga here
    takeEvery(IpfsNodeTypes.START_NODE_SUCCESS, photosTask),

    takeEvery(TextileTypes.IMAGE_UPLOAD_COMPLETE, removePayloadFile)
  ])
}
